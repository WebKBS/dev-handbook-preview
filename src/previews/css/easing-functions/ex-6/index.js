const restartAnimation = (el) => {
  const prev = getComputedStyle(el).animation;
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = prev;
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-replay]");
  if (!btn) return;

  const key = btn.getAttribute("data-replay");
  const target = document.querySelector(`[data-anim="${key}"]`);
  if (!target) return;

  restartAnimation(target);
});

// sprite controls
const sprite = document.querySelector('[data-sprite="sprite"] .spriteSheet');
const toggleBtn = document.getElementById("toggleSprite");
const restartBtn = document.getElementById("restartSprite");

toggleBtn.addEventListener("click", () => {
  const isPaused = getComputedStyle(sprite).animationPlayState === "paused";
  sprite.style.animationPlayState = isPaused ? "running" : "paused";
  toggleBtn.textContent = isPaused ? "Stop" : "Start";
});

restartBtn.addEventListener("click", () => {
  sprite.style.animationPlayState = "running";
  toggleBtn.textContent = "Stop";
  restartAnimation(sprite);
});
