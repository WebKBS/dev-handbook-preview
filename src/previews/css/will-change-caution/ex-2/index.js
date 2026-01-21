const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

const openModal = () => {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  modal.classList.remove("open");
  modal.classList.add("opening");

  requestAnimationFrame(() => {
    modal.classList.add("open");
    modal.focus({ preventScroll: true });
  });
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.classList.add("opening");

  const onEnd = (e) => {
    if (e.propertyName !== "transform") return;
    modal.removeEventListener("transitionend", onEnd);
    modal.classList.remove("opening");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    openBtn.focus({ preventScroll: true });
  };

  modal.addEventListener("transitionend", onEnd);
};

modal.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "transform") return;
  if (modal.classList.contains("open")) modal.classList.remove("opening");
});

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
});
