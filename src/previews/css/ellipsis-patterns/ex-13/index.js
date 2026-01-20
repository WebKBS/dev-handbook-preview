const text = document.querySelector(".clamp-text");
const button = document.querySelector(".toggle-button");

button.addEventListener("click", () => {
  if (text.style.webkitLineClamp) {
    text.style.webkitLineClamp = "unset";
    button.textContent = "접기";
  } else {
    text.style.webkitLineClamp = "3";
    button.textContent = "더 보기";
  }
});
