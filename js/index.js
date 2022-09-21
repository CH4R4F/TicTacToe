import TicTacToe from "./TicTacToe.js";

const startBtn = document.getElementById("start");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const modal = document.getElementById("players");
const inputPlayer1 = document.getElementById("player1");
const inputPlayer2 = document.getElementById("player2");

/**
 * @returns {void} this function is used to enable the start button if the input fields are NOT empty!
 */
function enableStart() {
  let player1 = inputPlayer1.value;
  let player2 = inputPlayer2.value;

  if (player1.match(/[a-zA-Z]+$/) && player2.match(/[a-zA-Z]+$/)) {
    startBtn.disabled = false;
  }
}

/**
 * @returns {void} this function is used to start the game
 */
function init() {
  let player1 = inputPlayer1.value;
  let player2 = inputPlayer2.value;

  modal.classList.add("hidden");
  const game = new TicTacToe(player1, player2);
  if(this == startBtn) {
    game.render()
  } else {
    game.showLeaderBoard()
  }
}


inputPlayer1.addEventListener("input", enableStart);
inputPlayer2.addEventListener("input", enableStart);
startBtn.addEventListener("click", init);
leaderboardBtn.addEventListener('click', init)
