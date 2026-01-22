const resetPreview = (el) => {
  el.style.animation = "none";
  el.style.opacity = "1";
  el.style.transform = "none";
  el.offsetHeight;
  el.style.animation = "";
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-retry]");
  if (!btn) return;

  const key = btn.getAttribute("data-retry");
  const target = btn.closest(".inner").querySelector(`[data-anim="${key}"]`);
  if (!target) return;

  resetPreview(target);
});

document.getElementById("retryAll").addEventListener("click", () => {
  document.querySelectorAll("[data-anim]").forEach(resetPreview);
});
