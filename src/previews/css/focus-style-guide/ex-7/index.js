const tabBtn = document.getElementById("tabBtn");
const skipLink = document.getElementById("skipLink");
const main = document.getElementById("main");

let step = 0;

tabBtn.addEventListener("click", () => {
  step = (step + 1) % 3;
  if (step === 1) skipLink.focus();
  else if (step === 2) main.focus();
  else tabBtn.focus();
});
