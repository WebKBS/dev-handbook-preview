// 2) 메뉴 슬라이드: open 클래스 토글
const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");
const setExpanded = (v) => {
  menuBtn.setAttribute("aria-expanded", String(v));
  menuBtn.textContent = v ? "메뉴 닫기" : "메뉴 열기";
  menuPanel.classList.toggle("open", v);
};
setExpanded(false);
menuBtn.addEventListener("click", () => {
  const next = menuBtn.getAttribute("aria-expanded") !== "true";
  setExpanded(next);
});

// 4) 탭 전환: active + aria-hidden(스크린리더/탭 이동도 안정)
const tabs = Array.from(document.querySelectorAll(".tab-btn"));
const panels = Array.from(document.querySelectorAll(".tab-content"));

const activate = (btn) => {
  const id = btn.getAttribute("aria-controls");
  tabs.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
  panels.forEach((p) => {
    const on = p.id === id;
    p.classList.toggle("active", on);
    p.setAttribute("aria-hidden", String(!on));
  });
};

tabs.forEach((btn) => btn.addEventListener("click", () => activate(btn)));
