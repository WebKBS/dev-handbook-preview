const target = document.querySelector('[data-anim="complex"]');

const replay = () => {
  const prev = getComputedStyle(target).animation;
  target.style.animation = "none";
  target.offsetHeight;
  target.style.animation = prev;
};

const reset = () => {
  target.style.animation = "none";
  target.style.opacity = "0";
  target.style.transform = "scale(0) rotate(-180deg)";
  target.offsetHeight;
  target.style.animation = "";
  target.style.opacity = "";
  target.style.transform = "";
};

document.getElementById("replayBtn").addEventListener("click", replay);
document.getElementById("resetBtn").addEventListener("click", reset);
