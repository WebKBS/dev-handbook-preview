const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const chip = document.getElementById("chip");

let index = 0;

const mod = (n, m) => ((n % m) + m) % m;

const render = () => {
  slides.forEach((el) => {
    el.classList.remove("current", "prev", "next");
  });

  const prev = mod(index - 1, slides.length);
  const next = mod(index + 1, slides.length);

  slides[index].classList.add("current");
  slides[prev].classList.add("prev");
  slides[next].classList.add("next");

  slides.forEach((el, i) => {
    const delta = i - index;
    const wrapDelta =
      Math.abs(delta) <= slides.length / 2
        ? delta
        : delta - Math.sign(delta) * slides.length;

    const x =
      i === index ? 0 : i === prev ? -420 : i === next ? 420 : wrapDelta * 900;

    el.style.transform = `translate(-50%, -50%) translateX(${x}px)`;
    el.style.zIndex = i === index ? "3" : i === prev || i === next ? "2" : "1";
    el.style.opacity =
      i === index ? "1" : i === prev || i === next ? "0.85" : "0.35";
    el.style.pointerEvents = i === index ? "auto" : "none";
  });

  chip.textContent = `current: ${index + 1}`;
};

prevBtn.addEventListener("click", () => {
  index = mod(index - 1, slides.length);
  render();
});

nextBtn.addEventListener("click", () => {
  index = mod(index + 1, slides.length);
  render();
});

render();
