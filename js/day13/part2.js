const fs = require("node:fs");
const { get } = require("node:http");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const grids = parse(fileContent);

  return grids;
}

const result = main(args[0] ?? "./input/day13/1.test.txt");
console.log(result);
