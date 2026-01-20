function setLineClamp(element, lines) {
  element.style.display = "-webkit-box";
  element.style.webkitLineClamp = lines;
  element.style.webkitBoxOrient = "vertical";
  element.style.overflow = "hidden";
}

const textEl = document.querySelector(".text");
setLineClamp(textEl, 3);

document.querySelectorAll("[data-lines]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lines = Number(btn.dataset.lines);
    setLineClamp(textEl, lines);

    document
      .querySelectorAll("[data-lines]")
      .forEach((b) => b.classList.remove("btn-primary"));
    btn.classList.add("btn-primary");
  });
});
