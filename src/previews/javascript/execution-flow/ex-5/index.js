const button = document.querySelector("button");

button.addEventListener("click", function () {
  console.log("버튼 클릭됨");

  // 화면 업데이트는 비동기적으로 처리
  this.textContent = "처리 중...";

  setTimeout(() => {
    this.textContent = "완료!";
    console.log("비동기 작업 완료");
  }, 2000);

  console.log("클릭 처리 끝 (비동기 작업은 진행 중)");
});
