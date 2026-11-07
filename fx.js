// 花びらの演出（キャンバス）
(function () {
  function Petals(canvas) {
    const g = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    let ps = [], level = 0.25, color = 'sakura', running = true;
    const COLORS = {
      sakura: ['#ffd1dc', '#f7a8bd', '#fbc4d2', '#ffe4ec'],
      indigo: ['#3b4aa8', '#2c3880', '#5363c9', '#24306e'],
      yozakura: ['#ffffff', '#ffd6e3', '#f3a6bd', '#ffe9f0']
    };
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(burst) {
      const c = COLORS[color];
      return {
        x: burst ? W / 2 + (Math.random() - .5) * 40 : Math.random() * W,
        y: burst ? H * .55 + (Math.random() - .5) * 40 : -20,
        vx: burst ? (Math.random() - .5) * 14 : -0.3 - Math.random() * .8,
        vy: burst ? (Math.random() - .7) * 14 : 0.6 + Math.random() * 1.1,
        r: 4 + Math.random() * 6, a: Math.random() * 6.28, va: (Math.random() - .5) * .12,
        w: Math.random() * 6.28, c: c[(Math.random() * c.length) | 0], life: burst ? 1 : 0, glow: color === 'yozakura'
      };
    }
    function draw(p) {
      g.save(); g.translate(p.x, p.y); g.rotate(p.a);
      const s = Math.abs(Math.cos(p.w)) * .7 + .3;
      g.scale(1, s);
      if (p.glow) { g.shadowColor = '#ff9fbf'; g.shadowBlur = 10; }
      g.fillStyle = p.c; g.globalAlpha = p.life ? Math.max(0, p.life) : .9;
      g.beginPath();
      g.moveTo(0, -p.r); g.bezierCurveTo(p.r, -p.r, p.r, p.r * .6, 0, p.r);
      g.bezierCurveTo(-p.r, p.r * .6, -p.r, -p.r, 0, -p.r);
      g.fill(); g.restore();
    }
    function tick() {
      if (!running) return;
      g.clearRect(0, 0, W, H);
      if (Math.random() < level) ps.push(make(false));
      for (const p of ps) {
        p.x += p.vx + Math.sin(p.w) * .4; p.y += p.vy; p.a += p.va; p.w += .04;
        if (p.life) { p.vx *= .985; p.vy = p.vy * .985 + .06; p.life -= .006; }
        draw(p);
      }
      ps = ps.filter(p => p.y < H + 30 && p.x > -40 && p.x < W + 40 && (!p.life || p.life > 0));
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', resize);
    resize(); requestAnimationFrame(tick);
    return {
      level(v) { level = v; },
      color(c) { color = COLORS[c] ? c : 'sakura'; },
      burst(n = 140) { for (let i = 0; i < n; i++) ps.push(make(true)); },
      resize, stop() { running = false; }, start() { if (!running) { running = true; requestAnimationFrame(tick); } }
    };
  }
  window.Petals = Petals;
})();
