const fs = require("node:fs");
const args = process.argv.slice(2);

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  let sum = 0;

  for (const line of fileContent) {
    let firstDigit = -1;
    let lastDigit = -1;

    line
      .trim()
      .split("")
      .flatMap((c) => (isNaN(Number(c)) ? [] : Number(c)))
      .forEach((digit) => {
        if (firstDigit === -1) {
          firstDigit = digit;
        }

        lastDigit = digit;
      });

    sum += firstDigit * 10 + lastDigit;
  }

  return sum;
}

const result = main(args[0] ?? "./input/1.test.txt");
console.log(result);
