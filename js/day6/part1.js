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

function calculateWins([time, record]) {
  const memo = Math.sqrt(time * time - 4 * record);
  const lowerBound = Math.floor(((-time + memo) / 2) * -1) + 1;
  const upperBound = Math.ceil(((-time - memo) / 2) * -1) - 1;
  return upperBound - lowerBound + 1;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8");
  const table = parse(fileContent);

  // getWins
  return table.map(calculateWins).reduce((a, b) => a * b, 1);
}

const result = main(args[0] ?? "./input/day6/1.test.txt");
console.log(result);
