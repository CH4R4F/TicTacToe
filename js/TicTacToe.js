class TicTacToe {
  constructor(player1, player2) {
    this.player1 = {
      name: player1.toLowerCase(),
      label: "X",
    };
    this.player2 = {
      name: player2.toLowerCase(),
      label: "O",
    };
    this.currentPlayer = this.player1.label;
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    this.winner = null;
    this.gameOver = false;

    this.container = document.getElementById("root");
  }

  /**
   *
   * @return {HTMLDivElement} the board element
   */
  render() {
    const gameBoard = document.createElement("div");
    gameBoard.classList.add("board");

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const boardCell = document.createElement("div");
        boardCell.classList.add("board-cell");
        boardCell.dataset.rowIndex = rowIndex;
        boardCell.dataset.cellIndex = cellIndex;
        boardCell.addEventListener("click", this.handleClick.bind(this), {
          once: true,
        });

        gameBoard.appendChild(boardCell);
      });
    });

    this.container.appendChild(gameBoard);
  }

  /**
   *
   * @returns {HTMLDivElement} the result modal
   */
  renderResult() {
    const result = document.createElement("div");
    result.classList.add("result");
    // reset button
    const resetButton = document.createElement("button");
    resetButton.classList.add("btn");
    resetButton.textContent = "Play again";
    resetButton.addEventListener("click", this.resetGame.bind(this));
    // leader board buton
    const leaderboardButton = document.createElement("button");
    leaderboardButton.classList.add("btn");
    leaderboardButton.textContent = "Leaderboard";
    leaderboardButton.addEventListener("click", this.showLeaderBoard.bind(this));

    const winner = document.createElement("h2");
    winner.textContent = this.winner ? `the winner is ${this.winner}` : "Tie :) Good game";

    result.appendChild(winner);
    result.appendChild(resetButton);
    result.appendChild(leaderboardButton);

    return result;
  }

  /**
   *
   * @param {e} event
   * @returns void
   */
  handleClick(e) {
    if (this.gameOver || e.target.dataset.selected) {
      return;
    }

    e.target.dataset.selected = true;
    e.target.textContent = this.currentPlayer;

    const rowIndex = e.target.dataset.rowIndex;
    const cellIndex = e.target.dataset.cellIndex;

    this.board[rowIndex][cellIndex] = this.currentPlayer;

    this.checkForWinner();
    if (this.winner || this.checkForTie()) {
      this.container.innerHTML = "";
      this.container.appendChild(this.renderResult());
      this.saveGame();
      return;
    }

    this.currentPlayer = this.currentPlayer === this.player1.label ? this.player2.label : this.player1.label;
  }

  /**
   *
   * @returns {boolean} true if there is a winner
   */
  checkForWinner() {
    const winningCombinations = [
      // Horizontal
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      // Vertical
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      // Diagonal
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    winningCombinations.forEach((combination) => {
      const [a, b, c] = combination;
      const [rowA, cellA] = a;
      const [rowB, cellB] = b;
      const [rowC, cellC] = c;

      const cellAValue = this.board[rowA][cellA];
      const cellBValue = this.board[rowB][cellB];
      const cellCValue = this.board[rowC][cellC];

      if (!(cellAValue && cellBValue && cellCValue)) {
        return;
      }

      if (cellAValue === cellBValue && cellBValue === cellCValue) {
        this.winner = this.player1.label === cellAValue ? this.player1.name : this.player2.name;
        this.gameOver = true;
      }
    });
  }

  /**
   * checks if the board is full or not
   * @returns {boolean} true if board is full, false if not
   */
  checkForTie() {
    return this.board.every((e) => e.every((n) => n !== ""));
  }

  /**
   * @returns {void} resets the board to the initial value
   */
  resetGame() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.winner = null;
    this.gameOver = false;

    this.container.innerHTML = "";
    this.render();
  }

  /**
   * @returns {void} saves the game to the local storage
   */
  saveGame() {
    let game = JSON.parse(localStorage.getItem("status")) || {};
    if (this.winner) {
      const looser = this.winner === this.player1.name ? this.player2.name : this.player1.name;

      // winner data
      if (game[this.winner]) {
        game[this.winner].wins++;
        game[this.winner].games++;
      } else {
        game[this.winner] = {
          wins: 1,
          lost: 0,
          games: 1,
        };
      }

      // looser data
      if (game[looser]) {
        game[looser].lost++;
        game[this.winner].games++;
      } else {
        game[looser] = {
          wins: 0,
          lost: 1,
          games: 1,
        };
      }
    } else {
      // add game for player1
      if (game[this.player1.name]) {
        game[this.player1.name].games++;
      } else {
        game[this.player1.name] = {
          wins: 0,
          lost: 0,
          games: 1,
        };
      }

      // add game for player2
      if (game[this.player2.name]) {
        game[this.player2.name].games++;
      } else {
        game[this.player2.name] = {
          wins: 0,
          lost: 0,
          games: 1,
        };
      }
    }
    localStorage.setItem("status", JSON.stringify(game));
  }

  showLeaderBoard() {
    let { ...players } = JSON.parse(localStorage.getItem("status")) || {};
    players = Object.entries(players);
    const table = document.createElement("table");
    table.classList.add("leaderboard");
    const thead = `
        <thead>
          <tr>
            <td>Username</td>
            <td>Games</td>
            <td>Wins</td>
            <td>Lost</td>
            <td>Win Rate</td>
          </tr>
        </thead>
    `;
    table.insertAdjacentHTML("afterbegin", thead);

    if (players.length <= 0) {
      const n = `
        <h2 style="align-text: center; margin-top: 2rem"> There is no record saved yet, Try playing a game </h2>
      `;
      table.insertAdjacentHTML("afterend", n);
      return;
    }

    const tbody = document.createElement("tbody");
    players.forEach(([player, stats]) => {
      const dataRow = `
        <tr>
          <td>${player}</td>
          <td>${stats.games}</td>
          <td>${stats.wins}</td>
          <td>${stats.lost}</td>
          <td>${(stats.wins / stats.games) * 100} %</td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", dataRow);
    });
    this.container.innerHTML = "";
    table.appendChild(tbody);
    this.container.appendChild(table);
  }
}

export default TicTacToe;
