import Snake from "./snake.js";

const init = () => {
  const snake = new Snake(50, 10, "-md");
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
    if (!snake.move()) {
      clearInterval(run);
      document.querySelector(
        "section"
      ).innerHTML = `<p class="font-bold text-7xl text-center mt-10">Game over</p>
            <p class="text-center text-xl mt-5 mb-10">Você bateu na parede</p>
            <button id="again" class="my-10 rounded bg-red-700 mx-auto w-3/12 text-white font-bold py-5 hover:bg-red-800">Jogar novamente</button>`;

      document.getElementById("again").addEventListener("click", () => {
        init();
      });
    }
  }, 500);
};

window.onload = init;
