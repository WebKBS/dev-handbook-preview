const setOn = (key, on) => {
  const el = document.querySelector(`[data-track="${key}"]`);
  if (!el) return;
  el.classList.toggle("on", on);
};

document.addEventListener("click", (e) => {
  const moveBtn = e.target.closest("[data-move]");
  const resetBtn = e.target.closest("[data-reset]");

  if (moveBtn) {
    setOn(moveBtn.getAttribute("data-move"), true);
    return;
  }
  if (resetBtn) {
    setOn(resetBtn.getAttribute("data-reset"), false);
  }
});

document.getElementById("moveAll").addEventListener("click", () => {
  ["normal-ease-out", "strong-ease-out", "gentle-ease-out", "custom"].forEach(
    (k) => setOn(k, true),
  );
});

document.getElementById("resetAll").addEventListener("click", () => {
  ["normal-ease-out", "strong-ease-out", "gentle-ease-out", "custom"].forEach(
    (k) => setOn(k, false),
  );
});
