import Snake from "./snake.js";

const init = () => {
  const unitSize =
    parseInt(window.sessionStorage.getItem("unit-size"), 10) || 50;
  const speed = parseInt(window.sessionStorage.getItem("speed"), 10) || 300;
  const snake = new Snake(
    unitSize,
    10,
    "-md",
    "neutral-50",
    "neutral-200",
    "green-600",
    "green-700",
    "red-600",
    "red-700"
  );
  setGameColors();
  snake.init();
  // snake.setSnakeInitialPosition();
  snake.setFruitPosition();
  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key.indexOf("Arrow") > -1) {
      snake.setDirection(e.key.replace("Arrow", "").toLowerCase());
    } else if (
      e.key.toLowerCase() === "w" &&
      snake.snake.direction !== "down"
    ) {
      snake.setDirection("up");
    } else if (e.key.toLowerCase() === "s" && snake.snake.direction !== "up") {
      snake.setDirection("down");
    } else if (
      e.key.toLowerCase() === "a" &&
      snake.snake.direction !== "right"
    ) {
      snake.setDirection("left");
    } else if (
      e.key.toLowerCase() === "d" &&
      snake.snake.direction !== "left"
    ) {
      snake.setDirection("right");
    }
  });

  const run = setInterval(() => {
    const game = snake.move();
    if (typeof game === 'string') {
      clearInterval(run);
      document.querySelector(
        "section"
      ).innerHTML = `<p class="font-bold text-7xl text-center mt-10">Game over</p>
            <p class="text-center text-xl mt-5">${game}</p>
            <p class="text-center mt-5 text-lg">Melhor pontuação</p>
            <p class="text-center text-2xl font-bold">${window.sessionStorage.getItem('best-score')|| 0}</p>
            <p class="text-center mt-5 text-lg">Pontuação atual</p>
            <p class="text-center text-2xl font-bold mb-10">${window.sessionStorage.getItem('score')}</p>
            <button id="again" class="my-10 rounded bg-red-700 mx-auto w-3/12 text-white font-bold py-5 hover:bg-red-800">Jogar novamente</button>`;

      document.getElementById("again").addEventListener("click", () => {
        init();
      });
    }
  }, speed);
};

document.getElementById("start").addEventListener("click", () => {
  init();
});

const setGameColors = () => {
  const getColor = window.sessionStorage;
  const colors = {
    snake: getColor.getItem("snake-color") || "#148c46",
    fruit: getColor.getItem("fruit-color") || "#a62321",
    container: getColor.getItem("container-color") || "#ffffff",
  };
  const root = document.querySelector(":root");
  for (const color in colors) {
    root.style.setProperty(`--${color}-color`, colors[color]);
  }
};
