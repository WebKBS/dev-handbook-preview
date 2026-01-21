const setRunning = (el, running) => {
  el.style.animationPlayState = running ? "running" : "paused";
};

const restart = (el) => {
  const prevAnim = getComputedStyle(el).animation;
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = prevAnim;
};

document.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-toggle]");
  const restartBtn = e.target.closest("[data-restart]");

  if (toggleBtn) {
    const key = toggleBtn.getAttribute("data-toggle");
    const target = document.querySelector(`[data-anim="${key}"]`);
    if (!target) return;

    const isPaused = getComputedStyle(target).animationPlayState === "paused";
    setRunning(target, isPaused);

    toggleBtn.textContent = isPaused ? "Stop" : "Start";
    return;
  }

  if (restartBtn) {
    const key = restartBtn.getAttribute("data-restart");
    const target = document.querySelector(`[data-anim="${key}"]`);
    if (!target) return;

    setRunning(target, true);
    const relatedToggle = document.querySelector(`[data-toggle="${key}"]`);
    if (relatedToggle) relatedToggle.textContent = "Stop";

    restart(target);
  }
});
