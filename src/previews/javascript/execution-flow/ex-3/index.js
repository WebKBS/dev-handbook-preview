function step1() {
  console.log("1단계 시작");

  setTimeout(function () {
    console.log("1단계 완료");
    step2();
  }, 1000);
}

function step2() {
  console.log("2단계 시작");

  setTimeout(function () {
    console.log("2단계 완료");
    step3();
  }, 500);
}

function step3() {
  console.log("3단계 시작");
  console.log("3단계 완료");
}

console.log("프로세스 시작");
step1();
console.log("프로세스 등록 완료");
