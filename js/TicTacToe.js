class TicTacToe {
  constructor(player1, player2) {
    this.player1 = {
      name: player1,
      label: "X",
    };
    this.player2 = {
      name: player2,
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

    this.container.appendChild(this.render());
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

    return gameBoard;
  }

  /**
   *
   * @returns {HTMLDivElement} the result modal
   */
  renderResult() {
    const result = document.createElement("div");
    result.classList.add("result");
    const resetButton = document.createElement("button");
    resetButton.textContent = "Play again";
    resetButton.addEventListener("click", this.resetGame.bind(this));
    const winner = document.createElement("h2");
    winner.textContent = this.winner
      ? `the winner is ${this.winner}`
      : "Tie :) Good game";

    result.appendChild(winner);
    result.appendChild(resetButton);

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
      return;
    }

    this.currentPlayer =
      this.currentPlayer === this.player1.label
        ? this.player2.label
        : this.player1.label;
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
        this.winner =
          this.player1.label === cellAValue
            ? this.player1.name
            : this.player2.name;
        this.gameOver = true;
      }
    });
  }

  checkForTie() {
    return this.board.every((e) => e.every((n) => n !== ""));
  }

  resetGame() {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.winner = null;
    this.gameOver = false;

    this.container.innerHTML = "";
    this.container.appendChild(this.render());
  }
}

export default TicTacToe;
