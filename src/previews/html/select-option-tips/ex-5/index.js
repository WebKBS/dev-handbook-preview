// 년도 옵션 동적 생성 (최근 100년)
const yearSelect = document.getElementById("birth-year");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= currentYear - 100; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year + "년";
  yearSelect.appendChild(option);
}

// 일 옵션 동적 생성
const daySelect = document.getElementById("birth-day");
for (let day = 1; day <= 31; day++) {
  const option = document.createElement("option");
  option.value = day.toString().padStart(2, "0");
  option.textContent = day + "일";
  daySelect.appendChild(option);
}
