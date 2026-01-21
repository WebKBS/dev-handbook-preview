const restart = (el) => {
  const prev = getComputedStyle(el).animation;
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = prev;
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-retry]");
  if (!btn) return;

  const key = btn.getAttribute("data-retry");
  const target = document.querySelector(`[data-anim="${key}"]`);
  if (!target) return;

  restart(target);
});

document.getElementById("resetOut").addEventListener("click", () => {
  const el = document.querySelector('[data-anim="bounce-out"]');
  el.style.animation = "none";
  el.style.transform = "scale(1)";
  el.offsetHeight;
  el.style.animation = "";
  el.style.transform = "";
});
