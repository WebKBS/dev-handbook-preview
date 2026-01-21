const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");

let count = 0;

const makeItem = () => {
  count += 1;

  const el = document.createElement("div");
  el.className = "list-item";
  el.innerHTML = `
      <div class="row">
        <div class="meta">
          <strong>Item #${count}</strong>
          <span>뷰포트 진입 직전 will-change 적용 → 진입 후 auto로 해제</span>
        </div>
        <span class="badge">+will-change</span>
      </div>
    `;

  return el;
};

const addItems = (n = 15) => {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) frag.appendChild(makeItem());
  list.appendChild(frag);

  document.querySelectorAll(".list-item:not([data-observed])").forEach((el) => {
    el.dataset.observed = "1";
    io.observe(el);
  });
};

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (!entry.isIntersecting) return;

      el.classList.add("about-to-appear");

      requestAnimationFrame(() => {
        el.classList.add("visible");
      });

      const onEnd = (e) => {
        if (e.propertyName !== "transform") return;
        el.removeEventListener("transitionend", onEnd);
        el.classList.remove("about-to-appear");
        el.classList.add("visible");
      };

      el.addEventListener("transitionend", onEnd, { once: true });

      io.unobserve(el);
    });
  },
  { rootMargin: "50px 0px" },
);

addBtn.addEventListener("click", () => addItems(15));

addItems(18);
