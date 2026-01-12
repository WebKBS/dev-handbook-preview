function showAlert(message) {
  const dialog = document.getElementById("alertDialog");
  const msgEl = document.getElementById("alertMessage");
  if (!dialog || !msgEl) return;

  msgEl.textContent = message;

  if (dialog.open) dialog.close();
  dialog.showModal();
}

// 사용
document.getElementById("testBtn").addEventListener("click", () => {
  showAlert("저장이 완료되었습니다.");
});
