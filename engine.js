// 本文の再生エンジン
(function () {
  const $ = s => document.querySelector(s);
  const ST = window.STORY;
  const SPEED = [70, 40, 22, 0];       // 文字送り（ms/字）：遅い・普通・速い・瞬間
  const AUTO = [3200, 2200, 1400];      // オートの待ち時間
  const MARK = { anger: '💢', surprise: '❗', sweat: '💦', sad: '💧', happy: '♪' };

  let pos = { c: 0, s: 0, l: 0 };
  let typing = null, full = '', auto = false, skip = false, timer = null, busy = false;
  let castNow = [], indigo = false, petals = null;
  const log = [];

  const eraOf = c => ST[c].era;
  function imgOf(key, era) {
    const ch = CHARS[key]; if (!ch) return null;
    const order = { kinder: ['kinder', 'elem', 'middle', 'high'], elem: ['elem', 'kinder', 'middle', 'high'], middle: ['middle', 'high', 'elem'], high: ['high', 'middle'] }[era];
    for (const e of order) if (ch.img[e]) return { src: ch.img[e] + '.webp', kid: e === 'kinder' || e === 'elem' };
    return null;
  }

  // ---------- 表示 ----------
  function setTheme(sc) {
    document.body.classList.toggle('themeB', !!sc.dark);
    document.body.classList.toggle('themeA', !sc.dark);
  }
  function setBg(sc) {
    const bg = $('#bg');
    bg.style.backgroundImage = `url(${sc.bg}.webp)`;
    bg.classList.toggle('night', sc.mood === 'night' || (sc.dark && sc.mood !== 'awaken'));
  }
  function setCast(sc, era) {
    const box = $('#cast');
    const list = sc.cast.map(k => ({ k, im: imgOf(k, era) })).filter(x => x.im);
    const sig = list.map(x => x.im.src).join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    const n = list.length;
    const xs = n === 1 ? [50] : n === 2 ? [32, 68] : [20, 50, 80];
    list.forEach((x, i) => {
      const d = document.createElement('div');
      d.className = 'ch' + (x.im.kid ? ' kid' : '');
      d.dataset.k = x.k;
      d.style.left = xs[i] + '%';
      d.innerHTML = `<img src="${x.im.src}" alt=""><div class="blush"></div><div class="mk"></div>`;
      box.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('in')));
    });
    castNow = list.map(x => x.k);
  }
  function focus(L) {
    const els = document.querySelectorAll('#cast .ch');
    els.forEach(el => {
      const on = !L.f || el.dataset.k === L.f || els.length === 1;
      el.classList.toggle('dim', !on);
      el.classList.toggle('focus', !!L.f && el.dataset.k === L.f && els.length > 1);
      el.classList.remove('m-blush', 'm-anger', 'm-surprise', 'm-happy', 'm-sad', 'm-sweat', 'show-mk');
    });
    if (L.m && L.f) {
      const el = document.querySelector(`#cast .ch[data-k="${L.f}"]`);
      if (el) {
        void el.offsetWidth;
        el.classList.add('m-' + L.m);
        const mk = el.querySelector('.mk');
        if (MARK[L.m]) { mk.textContent = MARK[L.m]; el.classList.add('show-mk'); }
      }
    }
  }
  function showCg(name, record = true) {
    const cg = $('#cg'), img = cg.querySelector('img');
    img.onload = () => {
      const r = img.naturalWidth / img.naturalHeight, scr = cg.clientWidth / cg.clientHeight;
      cg.classList.toggle('cover', Math.abs(r - scr) < 0.12 || (r < 0.75 && scr < 0.75 && r / scr < 1.25));
    };
    img.src = `${name}.webp`;
    cg.querySelector('.cg-blur').style.backgroundImage = `url(${name}.webp)`;
    cg.classList.remove('on'); void cg.offsetWidth; cg.classList.add('on');
    $('#cast').style.opacity = 0;
    if (record && !Save.d.cg[name]) { Save.d.cg[name] = 1; Save.put(); }
  }
  function hideCg() { $('#cg').classList.remove('on'); $('#cast').style.opacity = 1; }
  function toast(t) {
    const el = $('#toast'); el.textContent = t; el.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2600);
  }
  function fx(kind) {
    const stage = $('#stage');
    if (kind === 'shake') { stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }
    if (kind === 'flash' || kind === 'bloom' || kind === 'yozakura') { const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
    if (kind === 'bloom') { petals.color(indigo ? 'indigo' : 'sakura'); petals.burst(180); }
    if (kind === 'yozakura') { petals.color('yozakura'); petals.burst(260); petals.level(.9); }
    if (kind === 'indigo') { indigo = true; document.body.classList.add('indigo'); petals.color('indigo'); petals.burst(120); }
  }
  function skillBanner(t) {
    const s = $('#skill'); s.querySelector('span').textContent = t;
    s.classList.remove('go'); void s.offsetWidth; s.classList.add('go');
    const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    petals.burst(160);
  }

  // ---------- 文字送り ----------
  function type(L) {
    const t = $('#text');
    t.className = L.t === 'i' ? 'inner' : L.t === 'd' ? 'dlg' : '';
    full = L.s; $('#next').classList.remove('on');
    const sp = skip ? 0 : SPEED[Save.d.cfg.speed];
    if (!sp) { t.textContent = full; done(); return; }
    let i = 0; t.textContent = '';
    clearInterval(typing);
    typing = setInterval(() => {
      i += 1; t.textContent = full.slice(0, i);
      if (i >= full.length) { clearInterval(typing); typing = null; done(); }
    }, sp);
  }
  function done() {
    $('#next').classList.add('on');
    clearTimeout(timer);
    if (skip) timer = setTimeout(next, 70);
    else if (auto) timer = setTimeout(next, AUTO[Save.d.cfg.auto] + full.length * 25);
  }

  // ---------- 進行 ----------
  function scene() { return ST[pos.c].scenes[pos.s]; }
  function enterScene(fromLine) {
    const sc = scene(), era = eraOf(pos.c);
    setTheme(sc); setBg(sc);
    indigo = false; document.body.classList.remove('indigo');
    petals.color('sakura'); petals.level(sc.dark ? .12 : .22);
    if (sc.mood === 'awaken') petals.level(.5);
    hideCg();
    $('#cast').dataset.sig = '';
    setCast(sc, era);
    Music.play(sc.bgm);
    // 途中から再開するときは、それまでの一枚絵と藍色を復元
    for (let i = 0; i < fromLine; i++) {
      const L = sc.lines[i];
      if (L.t === 'cg') showCg(L.v, false);
      if (L.fx === 'indigo') { indigo = true; document.body.classList.add('indigo'); petals.color('indigo'); }
    }
    toast(sc.title);
    log.push({ sc: `第${ST[pos.c].n}章　${sc.title}` });
    Save.d.seen[sc.key] = true;
  }
  function show() {
    const sc = scene();
    let L = sc.lines[pos.l];
    while (L && L.t === 'cg') { showCg(L.v); pos.l++; L = sc.lines[pos.l]; }
    if (!L) { next(); return; }
    if (L.t === 'k') skillBanner(L.s.replace(/[【】]/g, ''));
    if (L.fx) fx(L.fx);
    focus(L);
    type(L);
    log.push({ t: L.t, s: L.s });
    if (log.length > 400) log.splice(0, log.length - 400);
    Save.d.cur = { ...pos }; Save.put();
  }
  function next() {
    if (busy) return;
    clearTimeout(timer);
    if (typing) { clearInterval(typing); typing = null; $('#text').textContent = full; done(); return; }
    pos.l++;
    if (pos.l >= scene().lines.length) {
      pos.l = 0; pos.s++;
      if (pos.s >= ST[pos.c].scenes.length) {
        Save.d.read[ST[pos.c].n] = true; Save.put();
        pos.s = 0; pos.c++;
        if (pos.c >= ST.length) { Save.d.cur = null; Save.now(); stopModes(); UI.ending(); return; }
        stopModes();
        chapterCard(() => { enterScene(0); show(); });
        return;
      }
      enterScene(0);
    }
    show();
  }
  function stopModes() {
    auto = false; skip = false;
    document.querySelectorAll('#hud [data-act="auto"],#hud [data-act="skip"]').forEach(b => b.classList.remove('on'));
  }
  function chapterCard(then) {
    const ch = ST[pos.c];
    const card = $('#card');
    card.querySelector('.card-era').textContent = ERA_LABEL[ch.era];
    card.querySelector('.card-no').textContent = `第 ${ch.n} 章`;
    card.querySelector('.card-title').textContent = ch.title;
    card.querySelector('.card-sub').textContent = /編$/.test(ch.sub) ? '' : ch.sub;
    card.querySelector('.card-lead').textContent = ch.lead;
    UI.open('card');
    card.querySelectorAll('.card-inner>*').forEach(e => { e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; });
    Music.play(ch.scenes[0].bgm);
    busy = true;
    setTimeout(() => {
      card.onclick = () => { card.onclick = null; busy = false; UI.open('stage'); then(); };
    }, 600);
  }

  window.Engine = {
    init() {
      petals = Petals($('#fx'));
      $('#tap').addEventListener('click', () => { if (skip) { stopModes(); return; } next(); });
      $('#box').addEventListener('click', () => { if (skip) { stopModes(); return; } next(); });
    },
    start(c, s = 0, l = 0, card = true) {
      stopModes(); clearTimeout(timer); clearInterval(typing); typing = null; busy = false; document.querySelector("#card").onclick = null;
      pos = { c, s, l }; log.length = 0;
      $('#stage').classList.remove('hidebox');
      if (card && s === 0 && l === 0) chapterCard(() => { enterScene(0); show(); });
      else { UI.open('stage'); enterScene(l); show(); }
      setTimeout(() => petals.resize(), 50);
    },
    toggleAuto() { skip = false; auto = !auto; if (auto && !typing) done(); return auto; },
    toggleSkip() { auto = false; skip = !skip; if (skip && !typing) next(); return skip; },
    stopModes,
    get pos() { return pos; },
    get log() { return log; },
    where() { const ch = ST[pos.c]; return { ch, sc: ch.scenes[pos.s] }; }
  };
})();
