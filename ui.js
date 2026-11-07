// 画面の切り替えとメニュー類
(function () {
  const $ = s => document.querySelector(s);
  const ST = window.STORY;
  let stack = [];

  function open(id) {
    // 本文・扉・タイトル・おわり は排他。パネル類は上に重ねる
    const base = ['stage', 'card', 'title', 'ending'];
    if (base.includes(id)) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
      stack = [];
    }
    $('#' + id).classList.add('show');
    if (!base.includes(id)) stack.push(id);
  }
  function close() {
    const id = stack.pop(); if (id) $('#' + id).classList.remove('show');
  }

  // ---------- タイトル ----------
  let titleFx = null;
  function toTitle() {
    Engine.stopModes();
    open('title');
    const t = $('#title');
    t.querySelector('[data-go="continue"]').disabled = !Save.d.cur;
    if (!titleFx) titleFx = Petals($('#titlefx'));
    titleFx.level(.35); titleFx.start();
    if (t.classList.contains('ready')) Music.play('title');
  }
  $('#title').addEventListener('click', e => {
    const t = $('#title');
    if (!t.classList.contains('ready')) { t.classList.add('ready'); Music.unlock(); Music.play('title'); return; }
    const b = e.target.closest('[data-go]'); if (!b || b.disabled) return;
    go(b.dataset.go);
  });
  document.addEventListener('click', () => Music.unlock(), { capture: true });

  function go(where) {
    if (where === 'new') { titleFx && titleFx.stop(); Engine.start(0); }
    if (where === 'continue' && Save.d.cur) { titleFx && titleFx.stop(); const c = Save.d.cur; Engine.start(c.c, c.s, c.l, false); }
    if (where === 'chapters') chapters();
    if (where === 'gallery') gallery();
    if (where === 'settings') settings();
    if (where === 'title') toTitle();
  }
  document.querySelectorAll('#ending [data-go]').forEach(b => b.onclick = () => toTitle());

  // ---------- 章選択 ----------
  function chapters() {
    const L = $('#chapters .list'); L.innerHTML = '';
    let era = '';
    const cur = Save.d.cur;
    ST.forEach((ch, i) => {
      if (ch.era !== era) { era = ch.era; const h = document.createElement('div'); h.className = 'era'; h.textContent = ERA_LABEL[era]; L.appendChild(h); }
      const b = document.createElement('button');
      b.className = 'chap' + (Save.d.read[ch.n] ? ' read' : '');
      b.innerHTML = `<div class="no">${ch.n}</div><div><div class="t">${ch.title}</div><div class="s">${ch.sub}</div></div>` +
        (cur && cur.c === i ? '<div class="here">読んでいるところ</div>' : '');
      b.onclick = () => { titleFx && titleFx.stop(); Engine.start(i); };
      L.appendChild(b);
    });
    open('chapters');
  }

  // ---------- 回想 ----------
  function gallery() {
    const G = $('#gallery .grid'); G.innerHTML = '';
    const order = [];
    ST.forEach(ch => ch.scenes.forEach(sc => sc.lines.forEach(l => { if (l.t === 'cg' && !order.includes(l.v)) order.push(l.v); })));
    let got = 0;
    order.forEach(name => {
      const d = document.createElement('button');
      const has = Save.d.cg[name];
      d.className = 'cell' + (has ? '' : ' lock');
      if (has) {
        got++;
        d.style.backgroundImage = `url(img/cg/${name}.webp)`;
        d.innerHTML = `<span>${CG_TITLE[name] || ''}</span>`;
        d.onclick = () => { const v = $('#viewer'); v.querySelector('img').src = `img/cg/${name}.webp`; v.querySelector('.cap').textContent = CG_TITLE[name] || ''; v.classList.add('on'); };
      }
      G.appendChild(d);
    });
    $('#gallery h2').textContent = `回想　${got} / ${order.length}`;
    open('gallery');
  }
  $('#viewer').onclick = () => $('#viewer').classList.remove('on');

  // ---------- 設定 ----------
  function seg(label, key, opts, note) {
    const r = document.createElement('div'); r.className = 'row';
    r.innerHTML = `<div class="lab">${label}</div><div class="seg">${opts.map((o, i) => `<button data-v="${i}" class="${Save.d.cfg[key] === i ? 'on' : ''}">${o}</button>`).join('')}</div>${note ? `<div class="note">${note}</div>` : ''}`;
    r.querySelectorAll('button').forEach(b => b.onclick = () => {
      Save.d.cfg[key] = +b.dataset.v; Save.put();
      r.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      applyCfg();
    });
    return r;
  }
  function settings() {
    const F = $('#settings .form'); F.innerHTML = '';
    F.appendChild(seg('文字の速さ', 'speed', ['ゆっくり', 'ふつう', 'はやい', '一瞬']));
    F.appendChild(seg('オートの待ち時間', 'auto', ['長め', 'ふつう', '短め']));
    F.appendChild(seg('文字の大きさ', 'fs', ['小', '中', '大']));
    const b = document.createElement('div'); b.className = 'row';
    b.innerHTML = `<div class="lab">BGM</div><div class="seg"><button data-v="1" class="${Save.d.cfg.bgm ? 'on' : ''}">あり</button><button data-v="0" class="${Save.d.cfg.bgm ? '' : 'on'}">なし</button></div>
      <div class="lab" style="margin-top:14px">音量</div><input type="range" min="0" max="1" step="0.05" value="${Save.d.cfg.vol}">`;
    b.querySelectorAll('.seg button').forEach(x => x.onclick = () => {
      Music.toggle(x.dataset.v === '1'); Save.put();
      b.querySelectorAll('.seg button').forEach(y => y.classList.toggle('on', y === x));
    });
    b.querySelector('input').oninput = e => { Music.volume(+e.target.value); Save.put(); };
    F.appendChild(b);
    const del = document.createElement('button'); del.className = 'danger'; del.textContent = '記録をすべて消す';
    del.onclick = () => { if (del.dataset.ok) { Save.reset(); applyCfg(); del.textContent = '消しました'; } else { del.dataset.ok = 1; del.textContent = 'もう一度押すと消えます'; } };
    F.appendChild(del);
    const n = document.createElement('p'); n.className = 'note'; n.textContent = '記録はこの端末のブラウザに保存されます。'; F.appendChild(n);
    open('settings');
  }
  function applyCfg() {
    document.documentElement.style.setProperty('--fs', ['14px', '16px', '18px'][Save.d.cfg.fs]);
  }

  // ---------- ログ ----------
  function showLog() {
    const L = $('#log .loglist'); L.innerHTML = '';
    for (const x of Engine.log) {
      const p = document.createElement(x.sc ? 'div' : 'p');
      if (x.sc) { p.className = 'sc'; p.textContent = x.sc; }
      else { p.textContent = x.s; if (x.t === 'i') p.className = 'i'; }
      L.appendChild(p);
    }
    open('log');
    requestAnimationFrame(() => { $('#log').scrollTop = $('#log').scrollHeight; });
  }

  // ---------- メニュー・しおり ----------
  function menu() {
    const w = Engine.where();
    $('#menu .menu-where').innerHTML = `第${w.ch.n}章　${w.ch.title}<br>${w.sc.title}`;
    open('menu');
  }
  function slots(mode) {
    const L = $('#slots .slotlist'); L.innerHTML = '';
    $('#slots .slots-h').textContent = mode === 'save' ? 'しおりをはさむ' : 'しおりから読む';
    Save.d.slots.forEach((s, i) => {
      const b = document.createElement('button'); b.className = 'slot';
      if (s) {
        const ch = ST[s.c], sc = ch.scenes[s.s];
        b.innerHTML = `<div class="th" style="background-image:url(img/bg/${sc.bg}.webp)"></div><div><div class="t">しおり ${i + 1}　第${ch.n}章</div><div class="s">${ch.title}／${sc.title}<br>${s.at}</div></div>`;
      } else b.innerHTML = `<div class="th"></div><div><div class="t">しおり ${i + 1}</div><div class="s">空き</div></div>`;
      b.onclick = () => {
        if (mode === 'save') {
          const d = new Date();
          Save.d.slots[i] = { ...Engine.pos, at: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}` };
          Save.now(); slots('save');
        } else if (s) { close(); close(); Engine.start(s.c, s.s, s.l, false); }
      };
      L.appendChild(b);
    });
    open('slots');
  }
  $('#menu').addEventListener('click', e => {
    const b = e.target.closest('[data-m]');
    if (!b) { if (e.target.id === 'menu') close(); return; }
    const m = b.dataset.m;
    if (m === 'close') close();
    if (m === 'save' || m === 'load') slots(m);
    if (m === 'chapters') { close(); chapters(); }
    if (m === 'settings') { close(); settings(); }
    if (m === 'title') { close(); Save.now(); toTitle(); }
  });

  $('#hud').addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'auto') { const on = Engine.toggleAuto(); b.classList.toggle('on', on); $('#hud [data-act="skip"]').classList.remove('on'); }
    if (a === 'skip') { const on = Engine.toggleSkip(); b.classList.toggle('on', on); $('#hud [data-act="auto"]').classList.remove('on'); }
    if (a === 'log') { Engine.stopModes(); showLog(); }
    if (a === 'hide') { $('#stage').classList.add('hidebox'); }
    if (a === 'menu') { Engine.stopModes(); menu(); }
  });
  // 隠した文字枠は、どこかをタップすると戻る
  $('#stage').addEventListener('click', e => {
    const s = $('#stage');
    if (s.classList.contains('hidebox') && !e.target.closest('#hud')) { e.stopPropagation(); s.classList.remove('hidebox'); }
  }, true);

  document.querySelectorAll('[data-back]').forEach(b => b.onclick = e => { e.stopPropagation(); close(); });

  window.UI = {
    open, close,
    ending() { open('ending'); Music.play('climax2'); }
  };

  // ---------- 起動 ----------
  applyCfg();
  Engine.init();
  toTitle();
})();
