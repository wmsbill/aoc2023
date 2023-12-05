const fs = require("node:fs");
const { get } = require("node:http");
const args = process.argv.slice(2);

const points = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
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

  return points[matches];
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");

  return parse(fileContent)
    .map(getPoints)
    .reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day4/1.test.txt");
console.log(result);
