class UI {
  constructor() {
    this.theBoard = document.querySelector(".game");
    this.body = document.querySelector("body");
    this.cont = document.querySelector(".container");
    this.coin = document.querySelector("span.coin");
    this.selectors = document.querySelectorAll(".selector");
    this.reset = document.querySelector(".reset");
  }
  getSpots() {
    this.spots = document.querySelectorAll(".spot");
  }
}

class connectFour {
  constructor() {
    this.ui = new UI();

    this.playOneRed = false;

    this.spots = [[], [], [], [], [], []];
    this.gameOver = false;
    this.gameSetup();
    this.ui.getSpots();
    this.eventsSetter();
  }
  eventsSetter() {
    this.ui.selectors.forEach((selector) => {
      selector.addEventListener("click", () => {
        selector.appendChild(this.ui.coin);
      });
    });
    this.ui.coin.addEventListener("click", (e) => {
      this.dropHandler(e);
    });
    this.ui.reset.addEventListener("click", () => {
      window.location.reload();
    });
  }

  dropHandler(e) {
    let col = e.target.parentElement.dataset.col;
    for (let i = 5; i >= 0; i--) {
      if (this.spots[i][col - 1] == null) {
        this.spots[i][col - 1] = this.playOneRed ? true : false; // = not ==
        break; // Stop after placing one piece
      } else if (i == 0) {
        return;
      }
    }
    this.toTheGame();
    this.playOneRed = !this.playOneRed;

    // Switch turns
    this.turnOrg(); // Update UI for next turn
    this.winner();
  }
  winner() {
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 7; i++) {
        if (
          this.horizontalCheck(i, j) ||
          this.verticalCheck(i, j) ||
          this.diagonalCheck(i, j) ||
          this.diagonalCheckReverse(i, j)
        ) {
          if (!this.playOneRed) {
            this.ui.cont.classList.add("red");
          } else {
            this.ui.cont.classList.add("blue");
          }
          return; // Stop checking after finding a winner
        }
      }
    }
  }
  toTheGame() {
    let num = 1;

    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 7; i++) {
        const spot = Array.from(this.ui.spots).find(
          (element) => element.dataset.num == num,
        );

        if (this.spots[j][i] === true) {
          spot.classList.add("red");
          spot.classList.remove("blue");
        } else if (this.spots[j][i] === false) {
          spot.classList.add("blue");
          spot.classList.remove("red");
        }
        num++;
      }
    }
  }
  gameSetup() {
    let num = 1;

    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 7; i++) {
        this.spots[j][i] = null;
        const spot = document.createElement("div");
        spot.className = "spot";
        spot.dataset.num = num;
        spot.dataset.col = i + 1;
        spot.dataset.row = j + 1;
        this.ui.theBoard.appendChild(spot);
        num++;
      }
    }
    this.playOneRed = true;
    this.turnOrg();
  }
  turnOrg() {
    if (this.playOneRed) {
      this.ui.body.classList.add("one-red");
      this.ui.body.classList.remove("two-blue");
      this.ui.coin.classList.remove("blue");
      this.ui.coin.classList.add("red");
    } else {
      this.ui.body.classList.remove("one-red");
      this.ui.body.classList.add("two-blue");
      this.ui.coin.classList.remove("red");
      this.ui.coin.classList.add("blue");
    }
    this.ui.body.classList.remove("animation");
    void this.ui.body.offsetHeight; // Force reflow
    this.ui.body.classList.add("animation");
  }

  horizontalCheck(col, row) {
    if (col > 3) return false; // Not enough space to the right

    const firstPiece = this.spots[row][col];
    if (firstPiece == null) return false;

    // Check next 3 positions
    for (let i = 1; i < 4; i++) {
      if (this.spots[row][col + i] !== firstPiece) {
        return false;
      }
    }
    return true;
  }

  // Check vertical (↓) - 4 in a column
  verticalCheck(col, row) {
    if (row > 2) return false; // Not enough space below

    const firstPiece = this.spots[row][col];
    if (firstPiece == null) return false;

    // Check next 3 positions down
    for (let i = 1; i < 4; i++) {
      if (this.spots[row + i][col] !== firstPiece) {
        return false;
      }
    }
    return true;
  }

  // Check diagonal (↘) - top-left to bottom-right
  diagonalCheck(col, row) {
    if (col > 3 || row > 2) return false; // Not enough space

    const firstPiece = this.spots[row][col];
    if (firstPiece == null) return false;

    // Check diagonal down-right
    for (let i = 1; i < 4; i++) {
      if (this.spots[row + i][col + i] !== firstPiece) {
        return false;
      }
    }
    return true;
  }

  // Check diagonal (↙) - top-right to bottom-left
  diagonalCheckReverse(col, row) {
    if (col < 3 || row > 2) return false; // Not enough space

    const firstPiece = this.spots[row][col];
    if (firstPiece == null) return false;

    // Check diagonal down-left
    for (let i = 1; i < 4; i++) {
      if (this.spots[row + i][col - i] !== firstPiece) {
        return false;
      }
    }
    return true;
  }
}

window.onload = () => {
  new connectFour();
};
