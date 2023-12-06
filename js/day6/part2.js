const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  const regex = /\D/g;
  const [timeInput, distanceInput] = fileContent.split("\n");
  const time = Number(timeInput.replace(regex, ""));
  const distance = Number(distanceInput.replace(regex, ""));

  return [time, distance];
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8");
  const [time, record] = parse(fileContent);
  let wins = 0;

  for (let i = 0; i < time; i++) {
    const distance = (time - i) * i;

    if (distance > record) {
      wins++;
    }
  }

  return wins;
}

const result = main(args[0] ?? "./input/day6/1.test.txt");
console.log(result);
