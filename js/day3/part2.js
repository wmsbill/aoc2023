const fs = require("node:fs");
const args = process.argv.slice(2);

function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function parse(lines) {
  const numberRegex = /\d{1,}/g;
  const tokenRegex = /[^a-z0-9.]/g;
  const tokenPosition = [];
  const numberPosition = new Map();

  lines.forEach((line, index) => {
    let token;
    let number;
    numberPosition.set(index, []);

    while ((token = tokenRegex.exec(line))) {
      tokenPosition.push({
        col: token.index,
        line: index,
      });
    }

    while ((number = numberRegex.exec(line))) {
      numberPosition.get(index).push({
        cols: new Set(range(number.index, number.index + number[0].length - 1)),
        value: Number(number[0]),
      });
    }
  });

  return [tokenPosition, numberPosition];
}

function findAdjacentInLine(numbers, line, col) {
  return (
    numbers
      .get(line)
      ?.filter(
        ({ cols }) => cols.has(col) || cols.has(col + 1) || cols.has(col - 1)
      ) || []
  );
}

function getAdjacentNumbers(token, numbers) {
  const { col, line } = token;
  const adjacentNumbers = [
    ...findAdjacentInLine(numbers, line - 1, col),
    ...findAdjacentInLine(numbers, line, col),
    ...findAdjacentInLine(numbers, line + 1, col),
  ];

  return adjacentNumbers;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [tokens, numbers] = parse(fileContent);

  return tokens
    .map((token) => getAdjacentNumbers(token, numbers))
    .filter((list) => list.length > 1)
    .map((list) => list.reduce((acc, { value }) => acc * value, 1))
    .reduce((acc, value) => acc + value, 0);
}

const result = main(args[0] ?? "./input/day3/1.test.txt");
console.log(result);
