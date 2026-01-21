const list = document.getElementById("seqList");
const items = [...list.querySelectorAll(".item")];

const replay = () => {
  items.forEach((el) => {
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "";
  });
};

const reset = () => {
  items.forEach((el) => {
    el.style.animation = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.offsetHeight;
    el.style.animation = "";
    el.style.opacity = "";
    el.style.transform = "";
  });
};

document.getElementById("replayBtn").addEventListener("click", replay);
document.getElementById("resetBtn").addEventListener("click", reset);
