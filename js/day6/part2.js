const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  const regex = /\D/g;
  const [timeInput, distanceInput] = fileContent.split("\n");
  const time = Number(timeInput.replace(regex, ""));
  const distance = Number(distanceInput.replace(regex, ""));

  return [time, distance];
}

function calculateWins(time, record) {
  const memo = Math.sqrt(time * time - 4 * record);
  const lowerBound = Math.floor(((-time + memo) / 2) * -1) + 1;
  const upperBound = Math.ceil(((-time - memo) / 2) * -1) - 1;
  return upperBound - lowerBound + 1;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8");
  const [time, record] = parse(fileContent);
  return calculateWins(time, record);
}

const result = main(args[0] ?? "./input/day6/1.test.txt");
console.log(result);
