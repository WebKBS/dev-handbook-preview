function showConfirm(title, message) {
  return new Promise((resolve) => {
    const dialog = document.getElementById("confirmDialog");
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;

    dialog.addEventListener(
      "close",
      () => {
        resolve(dialog.returnValue === "true");
      },
      { once: true },
    );

    dialog.showModal();
  });
}

// 사용
document.getElementById("deleteBtn").addEventListener("click", async () => {
  const confirmed = await showConfirm(
    "정말 삭제하시겠습니까?",
    "이 작업은 되돌릴 수 없습니다.",
  );

  if (confirmed) {
    console.log("삭제 실행");
  }
});
