const fs = require("node:fs");
const args = process.argv.slice(2);

const numRegex = /\d+/g;

function parse(lines) {
  return lines.map((line) => {
    const game = line.split(":")[1].trim();
    const [win, own] = game.split("|").map((numberSet) => {
      return Array.from(numberSet.matchAll(numRegex)).map(Number);
    });

    return [new Set(win), own];
  });
}

function getPoints([win, own]) {
  let matches = 0;

  for (num of own) {
    if (win.has(num)) {
      matches++;
    }
  }

  return matches;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const cardsPoints = parse(fileContent).map(getPoints);
  const cardsQuantity = Array.from({ length: cardsPoints.length }, () => 1);

  cardsPoints.forEach((points, index) => {
    for (let i = index + 1; i <= index + points; i++) {
      cardsQuantity[i] += cardsQuantity[index];
    }
  });

  return cardsQuantity.reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day4/1.test.txt");
console.log(result);
