// 保存（端末内）。読めない環境でも動くように、失敗したらメモリだけで続ける
(function () {
  const KEY = 'hyakka_ryoran_v1';
  const base = () => ({
    cur: null,                 // 続きの位置 {c,s,l}
    read: {},                  // 読み終えた章 {章番号:true}
    seen: {},                  // 見た場面 {"章-場面":true}
    cg: {},                    // 見た一枚絵
    slots: [null, null, null], // しおり
    cfg: { speed: 2, auto: 2, bgm: true, vol: 0.7, fs: 1 }
  });
  let data = base();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      data = Object.assign(base(), d, { cfg: Object.assign(base().cfg, d.cfg || {}) });
    }
  } catch (e) { /* 保存できない環境 */ }

  let timer = null;
  function flush() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { }
  }
  window.Save = {
    get d() { return data; },
    put() { clearTimeout(timer); timer = setTimeout(flush, 300); },
    now() { clearTimeout(timer); flush(); },
    reset() { data = base(); flush(); }
  };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
})();
