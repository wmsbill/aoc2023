const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(lines) {
  const numberRegex = /\d{1,}/g;
  const tokenRegex = /[^a-z0-9.]/g;
  const tokenPosition = new Map();
  const numberPosition = [];

  lines.forEach((line, index) => {
    let token;
    let number;
    tokenPosition.set(index, new Set());

    while ((token = tokenRegex.exec(line))) {
      tokenPosition.get(index).add(token.index);
    }

    while ((number = numberRegex.exec(line))) {
      const value = Number(number[0]);
      numberPosition.push({
        col: number.index,
        line: index,
        value,
        length: number[0].length,
      });
    }
  });

  return [tokenPosition, numberPosition];
}

function hasAdjacentToken(number, tokens) {
  const { col, line, length } = number;
  const positions = [];

  for (let l = Math.max(0, line - 1); l <= line + 1; l++) {
    for (let c = Math.max(0, col - 1); c <= col + length; c++) {
      positions.push([c, l]);
    }
  }

  return positions.some(([col, line]) => {
    const token = tokens.get(line);
    return token?.has(col);
  });
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const [tokens, numbers] = parse(fileContent);

  return numbers
    .flatMap((number) => (hasAdjacentToken(number, tokens) ? number.value : []))
    .reduce((acc, value) => acc + value, 0);
}

const result = main(args[0] ?? "./input/day3/1.test.txt");
console.log(result);
