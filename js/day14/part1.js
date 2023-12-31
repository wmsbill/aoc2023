const fs = require("node:fs");
const args = process.argv.slice(2);

function calculateWeights(grid, pointers) {
  const length = grid.length;
  const weights = pointers.slice();

  for (let [line, row] of grid.entries()) {
    for (let [col, char] of row.entries()) {
      if (char === "#") {
        pointers[col] = line + 1;
      }

      if (char === "O") {
        weights[col] += length - pointers[col];
        pointers[col]++;
      }
    }
  }

  return weights;
}

function main(file) {
  const grid = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(""));
  const pointers = Array.from({ length: grid[0].length }, () => 0);

  return calculateWeights(grid, pointers).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day14/1.test.txt");
console.log(result);
