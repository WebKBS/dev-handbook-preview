// ---------- cubic-bezier solver ----------
function cubicBezier(p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return function solve(x) {
    let t = x;

    // Newton-Raphson
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t) - x;
      const d2 = sampleCurveDerivativeX(t);
      if (Math.abs(x2) < 1e-6) return sampleCurveY(t);
      if (Math.abs(d2) < 1e-6) break;
      t = t - x2 / d2;
    }

    // binary search
    let t0 = 0,
      t1 = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const x2 = sampleCurveX(t);
      if (Math.abs(x2 - x) < 1e-6) return sampleCurveY(t);
      if (x > x2) t0 = t;
      else t1 = t;
      t = (t0 + t1) / 2;
    }

    return sampleCurveY(t);
  };
}

const BASE = [
  {
    id: "linear",
    label: "linear",
    css: "linear",
    bezier: null,
    note: "일정한 속도 (y=x)",
  },
  {
    id: "ease",
    label: "ease",
    css: "ease",
    bezier: [0.25, 0.1, 0.25, 1],
    note: "기본값. 자연스러운 완급",
  },
  {
    id: "ease-in",
    label: "ease-in",
    css: "ease-in",
    bezier: [0.42, 0, 1, 1],
    note: "천천히 시작 → 점점 가속",
  },
  {
    id: "ease-out",
    label: "ease-out",
    css: "ease-out",
    bezier: [0, 0, 0.58, 1],
    note: "빠르게 시작 → 부드럽게 멈춤",
  },
  {
    id: "ease-in-out",
    label: "ease-in-out",
    css: "ease-in-out",
    bezier: [0.42, 0, 0.58, 1],
    note: "시작/끝은 느리고 중간이 빠름",
  },
  {
    id: "custom",
    label: "custom",
    css: "cubic-bezier(0.25,0.1,0.25,1)",
    bezier: [0.25, 0.1, 0.25, 1],
    note: "직접 조절 가능한 곡선",
  },
];

const grid = document.getElementById("grid");
const showLinearRef = document.getElementById("showLinearRef");

// 카드별 그래프 점 애니메이션 RAF 관리
const dotAnim = new WeakMap(); // cardEl -> rafId

// helpers
function mapX(x) {
  return 10 + x * 100;
}
function mapY(y) {
  return 110 - y * 100;
}

function fmtBezier(bz) {
  if (!bz) return "y=x";
  const [a, b, c, d] = bz;
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}

function buildPath(points) {
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${mapX(p.x).toFixed(2)} ${mapY(p.y).toFixed(2)}`,
    )
    .join(" ");
}

function sampleEasing(def, steps = 90) {
  const points = [];
  let solve = null;

  if (def.id === "linear") solve = (x) => x;
  else {
    const bz = def.bezier;
    solve = cubicBezier(bz[0], bz[1], bz[2], bz[3]);
  }

  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = solve(x);
    points.push({ x, y });
  }
  return points;
}

// ✅ 반응형 이동거리 계산 (track 끝까지)
function getTravelDistance(cardEl) {
  const track = cardEl.querySelector(".track");
  const box = cardEl.querySelector("[data-box]");
  if (!track || !box) return 0;

  const trackRect = track.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();

  const cs = getComputedStyle(box);
  const leftInset = parseFloat(cs.left) || 0;
  const rightInset = leftInset;

  return Math.max(0, trackRect.width - boxRect.width - leftInset - rightInset);
}

// ✅ 핵심: transition shorthand를 건드리지 않고 duration만 0ms로 내려서 리셋
function snapBoxToX(box, x) {
  const prevDuration = box.style.transitionDuration;
  box.style.transitionDuration = "0ms";
  box.style.transform = `translateX(${x}px)`;
  box.getBoundingClientRect(); // reflow
  box.style.transitionDuration = prevDuration; // 원복
}

function makeCard(def) {
  const el = document.createElement("section");
  el.className = "card";
  el.dataset.easingId = def.id;

  el.innerHTML = `
          <div class="card-hd">
            <div class="title-row">
              <h2 class="name">${def.label}</h2>
              <span class="tag">${def.note}</span>
            </div>
            <div class="meta">
              <span><code class="k">${def.css}</code></span>
              <span><code class="k">${fmtBezier(def.bezier)}</code></span>
              <span class="mini">duration: <b style="color:rgba(255,255,255,0.88);">900ms</b></span>
            </div>
          </div>

          <div class="body">
            <div class="row">
              <div class="graph-wrap">
                <svg viewBox="0 0 120 120" role="img" aria-label="${def.label} easing graph">
                  <rect x="10" y="10" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.14)"></rect>
                  <line x1="10" y1="110" x2="110" y2="110" stroke="rgba(255,255,255,0.14)"></line>
                  <line x1="10" y1="110" x2="10" y2="10" stroke="rgba(255,255,255,0.14)"></line>

                  <path data-linear-ref d="M 10 110 L 110 10" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="4 4"></path>
                  <path data-curve d="" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="3"></path>

                  <circle data-dot r="3.5" cx="10" cy="110" fill="rgba(34,211,238,0.95)"></circle>
                </svg>
                <div class="hint">점이 이동하는 경로 = 진행률 변화 (x:시간 → y:진행률)</div>
              </div>

              <div class="demo">
                <div class="track" aria-label="transition demo track">
                  <div class="box" data-box></div>
                </div>
                <div class="demo-meta">
                  <span class="mini">CSS: <code class="k">transition-timing-function: ${def.css};</code></span>
                  <span class="mini">거리: <b data-dist style="color:rgba(255,255,255,0.88);">자동</b></span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-ft">
            <button class="btn" type="button" data-play>재생</button>
            <button class="btn" type="button" data-reset>리셋</button>
          </div>
        `;

  // curve
  el.querySelector("[data-curve]").setAttribute(
    "d",
    buildPath(sampleEasing(def)),
  );

  // transition 설정(이 값은 유지되고, reset/play에서는 duration만 0ms로 바꿨다가 복구)
  const box = el.querySelector("[data-box]");
  box.dataset.baseDuration = "900";
  box.style.transitionProperty = "transform";
  box.style.transitionDuration = "900ms";
  box.style.transitionTimingFunction = def.css;

  // bind
  el.querySelector("[data-play]").addEventListener("click", () =>
    playCard(el, def),
  );
  el.querySelector("[data-reset]").addEventListener("click", () =>
    resetCard(el),
  );

  return el;
}

function resetCard(cardEl) {
  const prev = dotAnim.get(cardEl);
  if (prev) cancelAnimationFrame(prev);

  const box = cardEl.querySelector("[data-box]");
  if (box) snapBoxToX(box, 0);

  const dot = cardEl.querySelector("[data-dot]");
  if (dot) {
    dot.setAttribute("cx", mapX(0));
    dot.setAttribute("cy", mapY(0));
  }

  cardEl.dataset.animating = "0";
}

function playCard(cardEl, def) {
  const prev = dotAnim.get(cardEl);
  if (prev) cancelAnimationFrame(prev);

  cardEl.dataset.animating = "1";

  const duration = 900;
  const dist = getTravelDistance(cardEl);

  const distEl = cardEl.querySelector("[data-dist]");
  if (distEl) distEl.textContent = `${Math.round(dist)}px`;

  // ✅ 항상 0에서 다시 시작(transition은 유지, duration만 0ms로 잠깐)
  const box = cardEl.querySelector("[data-box]");
  if (box) {
    snapBoxToX(box, 0);
    // reflow 후 목표 위치로 이동(이때는 transitionDuration=900ms로 이미 복구됨)
    box.getBoundingClientRect();
    box.style.transform = `translateX(${dist}px)`;
  }

  // graph dot
  let solve = null;
  if (def.id === "linear") solve = (x) => x;
  else {
    const [p1x, p1y, p2x, p2y] = def.bezier;
    solve = cubicBezier(p1x, p1y, p2x, p2y);
  }

  const dot = cardEl.querySelector("[data-dot]");
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const y = solve(t);

    if (dot) {
      dot.setAttribute("cx", mapX(t));
      dot.setAttribute("cy", mapY(y));
    }

    if (t < 1) {
      const id = requestAnimationFrame(tick);
      dotAnim.set(cardEl, id);
    } else {
      cardEl.dataset.animating = "0";
    }
  }

  dotAnim.set(cardEl, requestAnimationFrame(tick));
}

function updateLinearRefVisibility() {
  const on = showLinearRef.checked;
  document.querySelectorAll("[data-linear-ref]").forEach((p) => {
    p.style.display = on ? "block" : "none";
  });
}

// render
const cards = [];
for (const def of BASE) {
  const card = makeCard(def);
  cards.push({ def, el: card });
  grid.appendChild(card);
}

// custom wiring
const p1x = document.getElementById("p1x");
const p1y = document.getElementById("p1y");
const p2x = document.getElementById("p2x");
const p2y = document.getElementById("p2y");

function updateCustom() {
  const v = [
    parseFloat(p1x.value),
    parseFloat(p1y.value),
    parseFloat(p2x.value),
    parseFloat(p2y.value),
  ];

  const custom = cards.find((c) => c.def.id === "custom");
  custom.def.bezier = v;
  custom.def.css = `cubic-bezier(${v[0]}, ${v[1]}, ${v[2]}, ${v[3]})`;

  // header 코드 업데이트
  const codes = custom.el.querySelectorAll("code.k");
  codes[0].textContent = custom.def.css;
  codes[1].textContent = fmtBezier(custom.def.bezier);

  // curve 업데이트
  custom.el
    .querySelector("[data-curve]")
    .setAttribute("d", buildPath(sampleEasing(custom.def)));

  // timing-function 업데이트 (duration은 유지됨)
  const box = custom.el.querySelector("[data-box]");
  box.style.transitionTimingFunction = custom.def.css;

  // demo meta 업데이트
  const meta = custom.el.querySelector(".demo-meta code.k");
  meta.textContent = `transition-timing-function: ${custom.def.css};`;

  resetCard(custom.el);
}

[p1x, p1y, p2x, p2y].forEach((inp) =>
  inp.addEventListener("input", updateCustom),
);

// global controls
document.getElementById("playAll").addEventListener("click", () => {
  cards.forEach(({ def, el }) => playCard(el, def));
});
document.getElementById("resetAll").addEventListener("click", () => {
  cards.forEach(({ el }) => resetCard(el));
});
showLinearRef.addEventListener("change", updateLinearRefVisibility);

// resize observer: 끝에 있는 상태면 새 dist로 스냅
const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const track = entry.target;
    const cardEl = track.closest(".card");
    if (!cardEl) continue;

    const box = cardEl.querySelector("[data-box]");
    if (!box) continue;

    const dist = getTravelDistance(cardEl);
    const transform = getComputedStyle(box).transform;

    let currentX = 0;
    if (transform && transform !== "none") {
      const m = new DOMMatrixReadOnly(transform);
      currentX = m.m41 || 0;
      currentX = 0;
    }

    // 끝 상태면 새 dist로 스냅(transition 없이)
    if (Math.abs(currentX - dist) <= 2) {
      snapBoxToX(box, dist);
      const distEl = cardEl.querySelector("[data-dist]");
      if (distEl) distEl.textContent = `${Math.round(dist)}px`;
    }
  }
});

document.querySelectorAll(".track").forEach((t) => ro.observe(t));

// init
updateLinearRefVisibility();
cards.forEach(({ el }) => resetCard(el));
