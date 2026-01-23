function loadUserData(userId, callback) {
  console.log(`사용자 ${userId} 데이터 로딩 중...`);

  // 서버 요청 시뮬레이션 (2초 소요)
  setTimeout(function () {
    const userData = {
      id: userId,
      name: "김철수",
      email: "kim@example.com",
    };

    callback(userData); // 데이터를 콜백 함수에 전달
  }, 2000);
}

// 사용
loadUserData(123, function (user) {
  console.log("로딩 완료!");
  console.log(`이름: ${user.name}`);
  console.log(`이메일: ${user.email}`);
});

console.log("다른 작업 계속 진행 가능");
