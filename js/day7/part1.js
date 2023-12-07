const fs = require("node:fs");
const args = process.argv.slice(2);

const weight = new Map([
  ["2", 1],
  ["3", 2],
  ["4", 3],
  ["5", 4],
  ["6", 5],
  ["7", 6],
  ["8", 7],
  ["9", 8],
  ["T", 9],
  ["J", 10],
  ["Q", 11],
  ["K", 12],
  ["A", 13],
]);

function parse(fileContent) {
  const games = fileContent.map((line) => {
    const [hand, bet] = line.split(" ");
    return [hand, getHandStrength(hand), Number(bet)];
  });

  return games;
}

function getHandStrength(hand) {
  const count = new Map();
  let strength = 0;

  for (const card of hand) {
    count.set(card, (count.get(card) ?? 0) + 1);
  }

  for (const [_, amount] of count) {
    strength += 10 ** (amount - 1);
  }

  return strength;
}

function tieBreaker(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return weight.get(a[i]) - weight.get(b[i]);
    }
  }

  return 0;
}

function compare(a, b) {
  if (b[1] !== a[1]) {
    return a[1] - b[1];
  }

  return tieBreaker(a[0], b[0]);
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  return parse(fileContent)
    .sort(compare)
    .reduce((acc, [_, __, bet], index) => acc + bet * (index + 1), 0);
}

const result = main(args[0] ?? "./input/day7/1.test.txt");
console.log(result);
