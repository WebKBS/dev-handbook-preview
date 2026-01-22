const nav = document.getElementById("nav");
const hamburger = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".close");

function openNav() {
  nav.classList.add("active");
  hamburger.setAttribute("aria-expanded", "true");
}

function closeNav() {
  nav.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", () => {
  nav.classList.contains("active") ? closeNav() : openNav();
});

closeBtn.addEventListener("click", closeNav);

// 오버레이 배경 클릭으로 닫기(링크 영역 제외)
nav.addEventListener("click", (e) => {
  if (e.target === nav) closeNav();
});

// ESC로 닫기
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});
