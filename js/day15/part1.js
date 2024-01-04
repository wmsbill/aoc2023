const fs = require("node:fs");
const args = process.argv.slice(2);

function hash(input) {
  let val = 0;

  for (let i = 0; i < input.length; i++) {
    val += input.charCodeAt(i);
    val *= 17;
    val %= 256;
  }

  return val;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split(",");

  return fileContent.map((entry) => hash(entry)).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day15/1.test.txt");
console.log(result);
