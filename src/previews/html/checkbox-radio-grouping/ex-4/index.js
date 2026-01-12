function toggleGroup(parent, className) {
  const items = document.querySelectorAll(`.${className}`);
  items.forEach((item) => (item.checked = parent.checked));
}

function syncParentFromChildren(parentId, className) {
  const parent = document.getElementById(parentId);
  const items = [...document.querySelectorAll(`.${className}`)];
  const checkedCount = items.filter((i) => i.checked).length;

  // 모두 체크면 부모 체크, 하나라도 해제면 부모 해제
  parent.checked = checkedCount === items.length && items.length > 0;
  // 일부만 체크된 상태를 시각적으로 표현 (indeterminate)
  parent.indeterminate = checkedCount > 0 && checkedCount < items.length;

  return checkedCount;
}

function updateUI() {
  const docCount = syncParentFromChildren("documents", "document-item");
  const imgCount = syncParentFromChildren("images", "image-item");

  document.getElementById("documentsBadge").textContent = `${docCount} 선택`;
  document.getElementById("imagesBadge").textContent = `${imgCount} 선택`;

  const docsNested = document.getElementById("documentsNested");
  const imgsNested = document.getElementById("imagesNested");
  docsNested.classList.toggle("is-active", docCount > 0);
  imgsNested.classList.toggle("is-active", imgCount > 0);

  const selected = [
    ...document.querySelectorAll('input[name="files"]:checked'),
  ].map((el) => el.value.toUpperCase());

  document.getElementById("resultHint").textContent = selected.length
    ? `선택: ${selected.join(", ")}`
    : "선택: 없음";
}

// 부모 -> 자식
document.getElementById("documents").addEventListener("change", function () {
  toggleGroup(this, "document-item");
  updateUI();
});

document.getElementById("images").addEventListener("change", function () {
  toggleGroup(this, "image-item");
  updateUI();
});

// 자식 -> 부모 (상태 동기화)
document.querySelectorAll(".document-item, .image-item").forEach((el) => {
  el.addEventListener("change", updateUI);
});

// 초기 반영
updateUI();
