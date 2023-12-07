const fs = require("node:fs");
const args = process.argv.slice(2);

const weight = new Map([
  ["J", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
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
  if (hand === "JJJJJ") {
    return 10_000;
  }

  const count = new Map();
  let hasJoker = false;
  let strength = 0;

  for (const card of hand) {
    if (card === "J") {
      hasJoker = true;
    }
    count.set(card, (count.get(card) ?? 0) + 1);
  }

  if (hasJoker) {
    const jokerAmount = count.get("J");
    count.delete("J");

    let maxCard;

    count.forEach((amount, card) => {
      if (!maxCard || amount > count.get(maxCard)) {
        maxCard = card;
      }
    });

    count.set(maxCard, count.get(maxCard) + jokerAmount);
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
