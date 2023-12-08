const fs = require("node:fs");
const args = process.argv.slice(2);

function* circular(arr) {
  let i = 0;

  while (true) {
    yield arr[i];
    i = (i + 1) % arr.length;
  }
}

function parse([instructions, map]) {
  const route = new Map();
  const commands = circular(instructions.split(""));

  for (const line of map.split("\n")) {
    const [key, left, right] = line.matchAll(/\w+/g);
    route.set(key[0], { L: left[0], R: right[0] });
  }

  return [commands, route];
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n\n");
  const [instructions, route] = parse(fileContent);
  let acc = 0;
  let currentNode = "AAA";

  for (const direction of instructions) {
    currentNode = route.get(currentNode)[direction];
    acc++;

    if (currentNode === "ZZZ") {
      return acc;
    }
  }
}

const result = main(args[0] ?? "./input/day8/1.test.txt");
console.log(result);
