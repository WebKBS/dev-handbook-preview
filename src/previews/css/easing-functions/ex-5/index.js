const getChip = (key) => document.querySelector(`[data-chip="${key}"]`);

document.addEventListener("click", (e) => {
  const toggle = e.target.closest("[data-toggle]");
  const reset = e.target.closest("[data-reset]");

  if (toggle) {
    const key = toggle.getAttribute("data-toggle");
    const el = getChip(key);
    if (!el) return;
    el.classList.toggle("on");
    return;
  }

  if (reset) {
    const key = reset.getAttribute("data-reset");
    const el = getChip(key);
    if (!el) return;
    el.classList.remove("on");
  }
});
