let timer;
let turn = 0;
function turnOn() {
  timer = setInterval(turnFan, 200);
  let x = document.getElementById("on");
  x.disabled = true;
}

function turnFan() {
  let x = document.getElementById("myFan");
  turn += 60;
  x.style.transform = "rotate("+ (turn % 360) +"deg)"
}