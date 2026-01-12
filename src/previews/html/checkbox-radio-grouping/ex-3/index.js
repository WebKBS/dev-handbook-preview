function toggleAll(checkbox) {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.checked = checkbox.checked;
  });
}

// 개별 항목 체크 시 전체 선택 상태 업데이트
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("change", () => {
    const selectAll = document.getElementById("select-all");
    const items = document.querySelectorAll(".item");
    const allChecked = Array.from(items).every((i) => i.checked);
    selectAll.checked = allChecked;
  });
});

document.getElementById("select-all").addEventListener("change", () => {
  toggleAll(document.getElementById("select-all"));
});
