function toggleOtherInput(radio) {
  const otherInput = document.getElementById("other-contact");
  const allRadios = document.querySelectorAll('[name="contact"]');

  allRadios.forEach((r) => {
    r.addEventListener("change", () => {
      if (r.value === "other" && r.checked) {
        otherInput.disabled = false;
        otherInput.style.display = "block";
        otherInput.focus();
      } else {
        otherInput.disabled = true;
        otherInput.style.display = "none";
      }
    });
  });
}

document.querySelectorAll('[name="contact"]').forEach(toggleOtherInput);
