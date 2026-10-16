// Acilis animasyonu + bolum sistemi + ozel gemiler.
// Oyun paketi "ap:state" ve "ap:score" olaylarini yayar ve window.AP_SKINS'i hangara ekler.

// YENI GEMI EKLEMEK: listeye bir satir ekle. icon = herhangi bir emoji/karakter,
// color = parlama rengi, cost = prizma fiyati (0 = bedava), flip: true = ikonu saga cevir.
const ship = (id, icon, tr, color, cost = 0, flip = false) => ({
  id, icon, flip, cost, unlocked: cost === 0, color, trailColor: color, shape: 'icon',
  name: { en: tr, tr }, description: { en: 'Custom icon ship.', tr: 'Özel ikon gemi.' },
});
window.AP_SKINS = [
  ship('rocket', '🚀', 'Roket', '#ffb3c1'),
  ship('ufo', '🛸', 'UFO', '#9ad8ff'),
  ship('bee', '🐝', 'Arı', '#ffe08a', 0, true),
  ship('butterfly', '🦋', 'Kelebek', '#9ad8ff'),
  ship('chick', '🐤', 'Civciv', '#fff1a8', 0, true),
  ship('fish', '🐟', 'Balık', '#9ad8ff', 0, true),
  ship('unicorn', '🦄', 'Unicorn', '#f5b8ff', 0, true),
  ship('dragon', '🐉', 'Ejderha', '#9ee6c4', 0, true),
  ship('star', '⭐', 'Yıldız', '#ffe08a'),
  ship('balloon', '🎈', 'Balon', '#ff9bb8'),
  ship('alien', '👾', 'Uzaylı', '#d4b8ff'),
  ship('cat', '🐱', 'Kedi', '#ffbe8f'),
];

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bolumler oyunun biyomlariyla ayni esiklerde; 75'ten sonra her 30 puanda bir yeni bolum.
  const LEVELS = [
    { at: 0, name: 'Siber Turkuaz' },
    { at: 12, name: 'Güneş Kehribarı' },
    { at: 28, name: 'Ametist Boşluğu' },
    { at: 48, name: 'Hiper Zirve' },
    { at: 75, name: 'Kuantum Matrisi' },
  ];
  const EXTRA_STEP = 30;
  const levelAt = (score) => {
    const last = LEVELS[LEVELS.length - 1];
    if (score < last.at) {
      const i = LEVELS.findLastIndex((l) => score >= l.at);
      return { n: i + 1, name: LEVELS[i].name, from: LEVELS[i].at, to: LEVELS[i + 1].at };
    }
    const k = Math.floor((score - last.at) / EXTRA_STEP);
    const from = last.at + k * EXTRA_STEP;
    return { n: LEVELS.length + k, name: k ? `Sonsuz Rota ${k}` : last.name, from, to: from + EXTRA_STEP };
  };

  const css = document.createElement('style');
  css.textContent = `
  #ap-splash{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
    background:radial-gradient(circle at 50% 45%,#3a2f63,#1d1833 70%);font-family:Orbitron,Rajdhani,system-ui,sans-serif;color:#fff;
    transition:opacity .6s ease;cursor:pointer}
  #ap-splash.out{opacity:0;pointer-events:none}
  #ap-splash svg{width:120px;height:120px;animation:ap-fly 1.3s cubic-bezier(.2,.8,.2,1) both;filter:drop-shadow(0 0 18px #9ad8ff88)}
  #ap-splash h1{margin:0;font-size:clamp(34px,9vw,64px);font-weight:900;letter-spacing:.06em;
    background:linear-gradient(90deg,#9ad8ff,#d4b8ff,#ff9bb8);-webkit-background-clip:text;background-clip:text;color:transparent;
    animation:ap-rise .8s .5s ease-out both}
  #ap-splash p{margin:0;font-size:12px;letter-spacing:.4em;color:#c9c2ea;animation:ap-rise .8s .8s ease-out both}
  @keyframes ap-fly{from{transform:translateX(-60vw) rotate(-12deg);opacity:0}70%{transform:translateX(12px) rotate(3deg);opacity:1}to{transform:none}}
  @keyframes ap-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

  #ap-level{position:fixed;z-index:60;left:50%;top:max(14px,env(safe-area-inset-top));transform:translateX(-50%);pointer-events:none;
    min-width:190px;padding:7px 14px 9px;border-radius:14px;background:rgba(36,30,60,.78);border:1px solid #9ad8ff44;
    font-family:Rajdhani,system-ui,sans-serif;color:#eef;text-align:center;backdrop-filter:blur(6px);transition:opacity .3s}
  #ap-level[hidden]{display:none}
  @media (max-width:640px){#ap-level{top:calc(max(14px,env(safe-area-inset-top)) + 96px);min-width:170px;padding:5px 12px 7px}}
  #ap-level b{font-family:Orbitron,system-ui,sans-serif;font-size:13px;letter-spacing:.14em;color:#9ad8ff}
  #ap-level span{display:block;font-size:12px;color:#c9c2ea;margin-top:2px}
  #ap-level i{display:block;height:4px;margin-top:6px;border-radius:4px;background:#ffffff1a;overflow:hidden}
  #ap-level i::after{content:"";display:block;height:100%;width:var(--p,0%);background:linear-gradient(90deg,#9ad8ff,#d4b8ff,#ff9bb8);transition:width .25s}

  #ap-banner{position:fixed;z-index:61;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;
    font-family:Orbitron,system-ui,sans-serif;text-align:center}
  #ap-banner[hidden]{display:none}
  #ap-banner b{font-size:clamp(36px,10vw,72px);font-weight:900;letter-spacing:.08em;
    background:linear-gradient(90deg,#9ad8ff,#d4b8ff,#ff9bb8);-webkit-background-clip:text;background-clip:text;color:transparent;
    filter:drop-shadow(0 0 16px #d4b8ff88)}
  #ap-banner span{font-family:Rajdhani,system-ui,sans-serif;font-size:18px;letter-spacing:.2em;color:#eef;margin-top:6px}
  #ap-banner.show{animation:ap-pop 1.8s ease-out both}
  @keyframes ap-pop{0%{opacity:0;transform:scale(.7)}15%{opacity:1;transform:scale(1.06)}25%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-20px)}}
  @media (prefers-reduced-motion:reduce){#ap-splash *,#ap-banner.show{animation:none!important}}`;
  document.head.append(css);

  // --- acilis animasyonu ---
  const splash = document.createElement('div');
  splash.id = 'ap-splash';
  splash.innerHTML = `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M120 256 Q160 236 196 246" stroke="#ff9bb8" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M376 256 L196 178 L230 256 L196 334 Z" fill="#dff2ff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><circle cx="290" cy="256" r="12" fill="#ff9bb8"/></svg>
    <h1>AEROPULSE</h1><p>HRED GAMES STUDIO</p>`;
  document.body.append(splash);
  const hideSplash = () => { splash.classList.add('out'); setTimeout(() => splash.remove(), 650); };
  splash.addEventListener('click', hideSplash, { once: true });
  setTimeout(hideSplash, reduce ? 600 : 2400);

  // --- bolum arayuzu ---
  const pill = document.createElement('div');
  pill.id = 'ap-level';
  pill.hidden = true;
  const banner = document.createElement('div');
  banner.id = 'ap-banner';
  banner.hidden = true;
  document.body.append(pill, banner);

  let best = 0;
  try { best = +localStorage.getItem('ap-best-level') || 0; } catch {}
  let current = 1;

  const showPill = (lv, score) => {
    const pct = Math.min(100, ((score - lv.from) / (lv.to - lv.from)) * 100);
    pill.innerHTML = `<b>BÖLÜM ${lv.n}</b><span>${lv.name} · sonraki: ${lv.to}</span><i style="--p:${pct}%"></i>`;
    pill.hidden = false;
  };
  const showBanner = (lv) => {
    banner.innerHTML = `<b>BÖLÜM ${lv.n}</b><span>${lv.name}</span>`;
    banner.hidden = false;
    banner.classList.remove('show');
    void banner.offsetWidth; // animasyonu yeniden baslat
    banner.classList.add('show');
  };
  banner.addEventListener('animationend', () => { banner.hidden = true; });

  addEventListener('ap:score', (e) => {
    const lv = levelAt(e.detail);
    showPill(lv, e.detail);
    if (lv.n > current) { current = lv.n; showBanner(lv); }
  });

  addEventListener('ap:state', (e) => {
    const state = e.detail;
    if (state === 'PLAYING') {
      current = 1;
      showPill(levelAt(0), 0);
    } else if (state === 'GAMEOVER') {
      const record = current > best;
      if (record) { best = current; try { localStorage.setItem('ap-best-level', best); } catch {} }
      pill.innerHTML = `<b>ULAŞILAN: BÖLÜM ${current}</b><span>${record ? 'Yeni bölüm rekoru!' : `Rekor: Bölüm ${best}`}</span>`;
      pill.hidden = false;
    } else {
      pill.hidden = true;
    }
  });
})();
