class Snake {
  constructor(size, padding, radius, unitColorStart, unitColorEnd, snakeColorStart, snakeColorEnd, fruitColorStart, fruitColorEnd) {
    this.size = size;
    this.padding = padding;
    this.radius = radius;
    this.fruit = "";
    this.availableUnits = [];
    this.qtdRowUnits = 0;
    this.score = 0;
    this.unitColor = {
      start: unitColorStart,
      end: unitColorEnd,
    }
    this.fruitColor = {
      start: fruitColorStart,
      end: fruitColorEnd,
    },
    this.snake = {
      head: "0-0",
      tail: "0-1",
      body: [ "0-1","0-0"],
      direction: "right",
      color:{
        start: snakeColorStart,
        end: snakeColorEnd
      }
    };
  }

  init() {
    const unitSize = this.size + this.padding;
    const qtdRowUnits = parseInt(window.innerWidth / unitSize, 10);
    this.qtdRowUnits = qtdRowUnits;
    const qtdRows = parseInt(
      (window.innerHeight - document.querySelector("header").offsetHeight) /
        unitSize,
      10
    );
    const radiusOptions = ["-none", "-sm", "", "-md", "-lg", "-xl", "-full"];
    if (!radiusOptions.includes(this.radius)) {
      this.radius = "";
    }
    const rows = [];
    for (let i = 0; i < qtdRows; i++) {
      let row = `<div class='flex justify-between' style='margin-bottom:${
        this.padding / 2
      }px'>`;
      for (let j = 0; j < qtdRowUnits; j++) {
        const id = `${i}-${j}`;
        this.availableUnits.push(id);
        row += `<div id="${id}"class='units bg-gradient-to-br from-${this.unitColor.start} to-${this.unitColor.end} rounded${this.radius}' style="width:${this.size}px;height:${this.size}px"></div>`;
      }
      row += "</div>";
      rows.push(row);
    }
    this.availableUnits.splice(this.availableUnits.indexOf("4-15"), 1);
    this.availableUnits.splice(this.availableUnits.indexOf("4-16"), 1);
    const board = rows.join("");
    document.querySelector("section").innerHTML = board;
  }

  setFruitPosition() {
    const id = this.getRandomAvailableUnit();
    this.fruit = id;
    console.log(this.fruitColor);
    document.getElementById(id).classList.add(`from-${this.fruitColor.start}`);
    document.getElementById(id).classList.add(`to-${this.fruitColor.end}`);
  }

  setSnakeInitialPosition() {
    this.snake.head = this.getRandomAvailableUnit();
    const pos = this.snake.head.split("-").map((elem) => parseInt(elem, 10));

    const availableTailUnits = [];
    pos.map((elem, index) => {
      if (index === 0 && elem > 0) {
        availableTailUnits.push(`${elem - 1}-${pos[1]}`);
      }
      if (index === 0 && elem < this.qtdRowUnits) {
        availableTailUnits.push(`${elem + 1}-${pos[1]}`);
      }
      if (index === 1 && elem >= 0) {
        availableTailUnits.push(`${pos[0]}-${elem - 1}`);
      }
      if (index === 1 && elem < this.qtdRowUnits) {
        availableTailUnits.push(`${pos[0]}-${elem + 1}`);
      }
    });

    this.snake.tail = this.getRandomAvailableUnit(availableTailUnits);
    this.snake.body.push(this.snake.head);
    this.snake.body.push(this.snake.tail);
    this.setSnakeBody(this.snake.head);
    this.setSnakeBody(this.snake.tail);
    // set snake direction
    const headPos = this.snake.head
      .split("-")
      .map((elem) => parseInt(elem, 10));
    const tailPos = this.snake.tail
      .split("-")
      .map((elem) => parseInt(elem, 10));
    if (headPos[0] > tailPos[0] && headPos[1] === tailPos[1]) {
      this.snake.direction = "down";
    } else if (headPos[0] < tailPos[0] && headPos[1] === tailPos[1]) {
      this.snake.direction = "up";
    } else if (headPos[0] === tailPos[0] && headPos[1] > tailPos[1]) {
      this.snake.direction = "right";
    } else if (headPos[0] === tailPos[0] && headPos[1] < tailPos[1]) {
      this.snake.direction = "left";
    }
  }

  setScore(score) {
    this.score = score;
    document.querySelector("#score").innerText = this.score;
  }
  setSnakeBody(id) {
    const classList = document.getElementById(id).classList;
    classList.add(`from-${this.snake.color.start}`);
    classList.add(`to-${this.snake.color.end}`);
    if (classList.contains(`from-${this.fruitColor.start}`)) {
      classList.remove(`from-${this.fruitColor.start}`);
      classList.remove(`to-${this.fruitColor.end}`);
      this.setFruitPosition();
      let score = this.score + 1;
      this.setScore(score);
    }
  }
  removeOldTail() {
    const tail = this.snake.body[this.snake.body.length - 1];
    this.snake.body.pop();
    document.getElementById(tail).classList.remove(`from-${this.snake.color.start}`);
    document.getElementById(tail).classList.remove(`to-${this.snake.color.end}`);
  }
  getRandomAvailableUnit(available) {
    if (!available) {
      available = this.availableUnits;
    }
    const position = Math.floor(Math.random() * available.length);
    const id = available[position];
    const pos = this.availableUnits.indexOf(id);
    this.availableUnits.splice(pos, 1);
    return id;
  }

  move() {
    const head = this.snake.head;
    const tail = this.snake.tail;
    switch (this.snake.direction) {
      case "up":
        this.snake.head = `${parseInt(head.split("-")[0], 10) - 1}-${
          head.split("-")[1]
        }`;
        break;
      case "down":
        this.snake.head = `${parseInt(head.split("-")[0], 10) + 1}-${
          head.split("-")[1]
        }`;
        break;
      case "left":
        this.snake.head = `${head.split("-")[0]}-${
          parseInt(head.split("-")[1], 10) - 1
        }`;
        break;
      case "right":
        this.snake.head = `${head.split("-")[0]}-${
          parseInt(head.split("-")[1], 10) + 1
        }`;
        break;
    }
    const gameOver = this.checkGameOver();
    if (!!gameOver) {
      const bestScore = window.sessionStorage.getItem("best-score");
      if(bestScore === null){
        window.sessionStorage.setItem("best-score", this.score);
      }
      else if (this.score > parseInt(bestScore, 10)) {
        window.sessionStorage.setItem("best-score", this.score);
      }
      window.sessionStorage.setItem("score", this.score);
      return gameOver;
    }
    const oldScore = this.score;
    this.snake.body.unshift(this.snake.head);
    this.setSnakeBody(this.snake.head);
    this.availableUnits.splice(this.availableUnits.indexOf(this.snake.head), 1);

    if (oldScore === this.score) {
      this.availableUnits.push(this.snake.tail);
      this.removeOldTail();
      this.snake.tail = this.snake.body[this.snake.body.length - 1];
    }
    return true;
  }

  setDirection(direction) {
    this.snake.direction = direction;
  }

  checkGameOver() {
    const head = this.snake.head;
    const headParts = head.split("-");
    try{
      if (isNaN(headParts[0]) || isNaN(headParts[1])) {
        return "Você bateu na parede";
      }
      else if(document.getElementById(`${head}`) == null){
        return "Você bateu na parede";
      } 
      else if (this.snake.body.includes(head, 2)) {
        return "Você bateu em si mesmo";
      } else if (headParts[0] < 0 || headParts[0] > this.qtdRowUnits) {
        return "Você bateu na parede";
      } else if (headParts[1] < 0 || headParts[1] > this.qtdColUnits) {
        return "Você bateu na parede";
      } else {
        return false;
      }
    }catch(err){
      console.log("game over\n\n Bateu na parede");
      return "Ocorreu um erro";
    }
  }
}

export default Snake;
