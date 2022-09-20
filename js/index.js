import TicTacToe from "./TicTacToe.js";

const startBtn = document.getElementById("start")
const modal = document.getElementById("players")
const inputPlayer1 = document.getElementById("player1")
const inputPlayer2 = document.getElementById("player2")


function enableStart() {
  let player1 = inputPlayer1.value;
  let player2 = inputPlayer2.value;

  if (player1.match(/[a-zA-Z]+$/) && player2.match(/[a-zA-Z]+$/)) {
    startBtn.disabled = false;
  }
}

function startGame() {
  let player1 = inputPlayer1.value;
  let player2 = inputPlayer2.value;

  modal.classList.add("hidden");
  new TicTacToe(player1, player2);
}

inputPlayer1.addEventListener("input", enableStart)
inputPlayer2.addEventListener("input", enableStart)
startBtn.addEventListener("click", startGame)