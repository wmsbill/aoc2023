const fs = require("node:fs");
const args = process.argv.slice(2);

function sanitizeGameId(gameId) {
  return Number(gameId.split(" ")[1]);
}

function sanitizeInput(input) {
  const sets = input.split(";").map((set) => {
    return set.split(",").map((draw) => {
      const [amount, color] = draw.trim().split(" ");

      return {
        [color]: Number(amount),
      };
    });
  });

  return sets;
}

function parse(lines) {
  const sanitizedInput = [];

  for (const line of lines) {
    const [gameId, input] = line.split(":");

    sanitizedInput.push({
      gameId: sanitizeGameId(gameId),
      input: sanitizeInput(input.trim()),
    });
  }

  return sanitizedInput;
}

function isGamePossible(game, bagContent) {
  const { input } = game;

  return input.every((set) => {
    return set.every((draw) => {
      const [color, amount] = Object.entries(draw)[0];

      return bagContent[color] >= amount;
    });
  });
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const gameSet = parse(fileContent);
  const bagContent = {
    red: 12,
    green: 13,
    blue: 14,
  };

  return gameSet
    .filter((game) => {
      return isGamePossible(game, bagContent);
    })
    .reduce((acc, game) => {
      return acc + game.gameId;
    }, 0);
}

const result = main(args[0] ?? "./input/day2/1.test.txt");
console.log(result);
