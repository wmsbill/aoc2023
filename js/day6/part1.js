const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  const numberRegex = /\d+/g;
  const [timeInput, distanceInput] = fileContent.split("\n");
  const times = [...timeInput.matchAll(numberRegex)].map(Number);
  const distances = [...distanceInput.matchAll(numberRegex)].map(Number);
  const table = [];

  for (let i = 0; i < times.length; i++) {
    table.push([times[i], distances[i]]);
  }

  return table;
}

function getWins([time, record]) {
  let wins = 0;

  for (let i = 0; i < time; i++) {
    const distance = (time - i) * i;

    if (distance > record) {
      wins++;
    }
  }

  return wins;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8");
  const table = parse(fileContent);

  return table.map(getWins).reduce((a, b) => a * b, 1);
}

const result = main(args[0] ?? "./input/day6/1.test.txt");
console.log(result);
