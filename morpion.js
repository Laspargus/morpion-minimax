class Morpion {
  constructor(player) {
    this.player = player;
    this.ia = player == "J1" ? "J2" : "J1";
    this.map = [];
    this.result = "";
    for (let i = 0; i < 3; i++) {
      this.map[i] = [];
      for (let j = 0; j < 3; j++) {
        this.map[i][j] = "EMPTY";
        document.getElementById(this.getZone(i, j)).onclick = () =>
          this.playerTurn(i, j);
      }
    }
    this.finish = false;
    if (this.ia === "J1") this.iaTurn();
  }

  getZone = (x, y) => {
    if (y == 0) return "A" + (x + 1);
    else if (y == 1) return "B" + (x + 1);
    else return "C" + (x + 1);
  };

  checkDraw = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.map[x][y] === "EMPTY") return false;
      }
    }
    return true;
  };

  fillGrid = (x, y, player) => {
    const image = player == this.player ? "croix" : "rond";
    const zone = this.getZone(x, y);

    if (this.map[x][y] != "EMPTY") return false;
    this.map[x][y] = player;
    document.getElementById(
      zone
    ).style.backgroundImage = `url(image-morpion/${image}.png)`;
    document.getElementById(zone).className += " filled";
    this.checking(player);
    return true;
  };

  checking = (player) => {
    const one = this.map[0][0];
    const two = this.map[0][1];
    const three = this.map[0][2];
    const four = this.map[1][0];
    const five = this.map[1][1];
    const six = this.map[1][2];
    const seven = this.map[2][0];
    const eight = this.map[2][1];
    const nine = this.map[2][2];
    if (
      (one === two && one === three && one != "EMPTY") ||
      (four === five && four === six && four != "EMPTY") ||
      (seven === eight && seven === nine && seven != "EMPTY") ||
      (one === five && one === nine && one != "EMPTY") ||
      (three === five && three === seven && three != "EMPTY") ||
      (one === four && one === seven && one != "EMPTY") ||
      (two === five && two === eight && two != "EMPTY") ||
      (three === six && three === nine && three != "EMPTY")
    ) {
      this.finish = true;
      if (player == this.ia) {
        document.getElementById("win").textContent = "L'IA a gagné !";
        this.result = "loose";
      } else if (player == this.player) {
        document.getElementById("win").textContent = "Tu as battu l'IA !";
        this.result = "win";
      }
    } else if (this.checkDraw()) {
      document.getElementById("win").textContent = "Vous êtes à égalité";
      this.finish = "tie";
    }
  };

  playerTurn = (x, y) => {
    if (this.finish) return;
    if (!this.fillGrid(x, y, this.player))
      return alert("La case n'est pas vide");
    else if (!this.finish) this.iaTurn();
  };

  iaTurn = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.map[i][j] == "EMPTY") {
          this.map[i][j] = this.ia;
          let score = this.minimax(this.map, 0, false);
          this.map[i][j] = "EMPTY";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    this.fillGrid(move.i, move.j, this.ia);
  };

  minimax = (map, depth, tryToWin) => {
    if (tryToWin == true) {
      this.checking(this.ia);
      if ((this.finish = true && this.result == "loose")) {
        return 1;
      } else if ((this.finish = true && this.result == "tie")) {
        return 0;
      }
    } else {
      this.checking(this.player);
      if ((this.finish = true && this.result == "win")) {
        return -1;
      } else if ((this.finish = true && this.result == "tie")) {
        return 0;
      }
    }

    if (tryToWin == true) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (map[i][j] == "EMPTY") {
            map[i][j] = this.ia;
            let score = this.minimax(map, depth + 1, false);
            map[i][j] = "EMPTY";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (map[i][j] == "EMPTY") {
            map[i][j] = this.player;
            let score = this.minimax(map, depth + 1, true);
            map[i][j] = "EMPTY";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };
}

const morpion = new Morpion("J1");

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
