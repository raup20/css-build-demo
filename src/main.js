import "./style.css";

const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");

function getRandomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomColor() {
  const newColor = getRandomHexColor();

  colorBox.style.backgroundColor = newColor;
  colorCode.textContent = newColor;
  message.textContent = "";

  colorBox.classList.remove("active-box");
  void colorBox.offsetWidth;
  colorBox.classList.add("active-box");
}

colorBox.addEventListener("click", setRandomColor);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(colorCode.textContent);
    message.textContent = "Hex code copied!";
  } catch (error) {
    message.textContent = "Could not copy the hex code.";
  }
});

setRandomColor();