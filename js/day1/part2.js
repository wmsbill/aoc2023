const fs = require("node:fs");
const args = process.argv.slice(2);

const sanitizeMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  zero: 0,
};

function sanitize(line) {
  const regex = /(?=(one|two|three|four|five|six|seven|eight|nine|zero|\d))/g;
  return Array.from(
    line.matchAll(regex),
    (x) => sanitizeMap[x[1]] || Number(x[1])
  );
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  let sum = 0;

  for (const line of fileContent) {
    let firstDigit = -1;
    let lastDigit = -1;

    sanitize(line).forEach((digit) => {
      if (firstDigit === -1) {
        firstDigit = digit;
      }

      lastDigit = digit;
    });

    sum += firstDigit * 10 + lastDigit;
  }

  return sum;
}

const result = main(args[0] ?? "./input/day1/2.test.txt");
console.log(result);
