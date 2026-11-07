// BGM：Web Audio で音量を制御（iPhoneでも音量・フェードが効くように）
(function () {
  let ctx = null, master = null;
  let cur = null; // {name, el, gain}
  let wanted = null;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = Save.d.cfg.vol;
      master.connect(ctx.destination);
      return true;
    } catch (e) { return false; }
  }

  function fadeOut(t) {
    if (!t) return;
    const g = t.gain.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0, now + 1.2);
    setTimeout(() => { try { t.el.pause(); t.el.src = ''; } catch (e) { } }, 1400);
  }

  function play(name) {
    wanted = name || null;
    if (!Save.d.cfg.bgm || !ctx) return;
    if (cur && cur.name === name) return;
    fadeOut(cur); cur = null;
    if (!name) return;
    const file = (window.BGM && BGM[name]) || name;
    const el = new Audio(file + '.mp3');
    el.loop = true; el.preload = 'auto'; el.crossOrigin = 'anonymous';
    let src;
    try { src = ctx.createMediaElementSource(el); } catch (e) { return; }
    const gain = ctx.createGain(); gain.gain.value = 0;
    src.connect(gain); gain.connect(master);
    const t = { name, el, gain };
    cur = t;
    el.play().then(() => {
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + 1.5);
    }).catch(() => { });
  }

  window.Music = {
    unlock() { if (ensure() && wanted && (!cur || cur.name !== wanted)) { const w = wanted; wanted = null; play(w); } },
    play,
    stop() { wanted = null; if (ctx) fadeOut(cur); cur = null; },
    volume(v) { Save.d.cfg.vol = v; if (master) master.gain.value = v; },
    toggle(on) { Save.d.cfg.bgm = on; if (!on) { const w = wanted; this.stop(); wanted = w; } else { ensure(); const w = wanted; cur = null; play(w); } }
  };
})();
