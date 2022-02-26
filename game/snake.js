class Snake {
  constructor(size, padding, radius) {
    this.size = size;
    this.padding = padding;
    this.radius = radius;
    this.fruit = "";
    this.availableUnits = [];
    this.qtdRowUnits = 0;
    this.score = 0;
    this.snake = {
      head: "4-15",
      tail: "4-16",
      body: ["4-15", "4-16"],
      direction: "left",
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
        row += `<div id="${id}"class='units rounded${this.radius}' style="width:${this.size}px;height:${this.size}px"></div>`;
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
    document.getElementById(id).classList.add("fruit");
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
    classList.add("snake");
    if (classList.contains("fruit")) {
      classList.remove("fruit");
      this.setFruitPosition();
      let score = this.score + 1;
      this.setScore(score);
    }
  }
  removeOldTail() {
    const tail = this.snake.body[this.snake.body.length - 1];
    this.snake.body.pop();
    document.getElementById(tail).classList.remove("snake");
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
    if (this.checkGameOver()) {
      return false;
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

      if (document.getElementById(head).classList.contains("snake")) {
        // debugger;
        console.log("game over\n\n Bateu em si mesmo");
        return true;
      } else if (headParts[0] < 0 || headParts[0] > this.qtdRowUnits) {
        // debugger;
        console.log("game over\n\n Bateu na parede");
        return true;
      } else if (headParts[1] < 0 || headParts[1] > this.qtdColUnits) {
        console.log("game over\n\n Bateu na parede");
        return true;
      } else {
        return false;
      }
    }catch(err){
      console.log("game over\n\n Bateu na parede");
      return true;
    }
  }
}

export default Snake;
