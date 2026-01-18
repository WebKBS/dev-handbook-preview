const menu = document.getElementById("navMenu");
const toggle = document.querySelector(".nav-toggle");
const closeBtn = document.querySelector(".nav-close");

function openMenu() {
  menu.classList.add("active");
  toggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  menu.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
}

toggle.addEventListener("click", () => {
  menu.classList.contains("active") ? closeMenu() : openMenu();
});

closeBtn.addEventListener("click", closeMenu);

// ESC로 닫기 (모바일 오버레이에서 유용)
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
