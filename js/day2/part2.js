const fs = require("node:fs");
const args = process.argv.slice(2);

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
  return lines.map((line) => {
    const input = line.split(":")[1];
    return sanitizeInput(input.trim());
  });
}

function getMinSetPower(sets) {
  const minSet = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const draw of sets.flat()) {
    const [color, amount] = Object.entries(draw)[0];

    if (amount > minSet[color]) {
      minSet[color] = amount;
    }
  }

  return minSet.red * minSet.green * minSet.blue;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const games = parse(fileContent);

  return games.map(getMinSetPower).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day2/2.test.txt");
console.log(result);
