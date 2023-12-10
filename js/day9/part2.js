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
  const startNodes = [];

  for (const line of map.split("\n")) {
    const [key, left, right] = line.matchAll(/\w+/g);

    if (key[0].charAt(2) === "A") {
      startNodes.push(key[0]);
    }

    route.set(key[0], { L: left[0], R: right[0] });
  }

  return [startNodes, instructions.split(""), route];
}

function gcd(a, b) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n\n");
  const [startNodes, instructions, route] = parse(fileContent);

  const [first, ...result] = startNodes.map((node) => {
    console.info(node);

    let acc = 0;
    let currentNode = node;
    const commands = circular(instructions);

    for (const direction of commands) {
      currentNode = route.get(currentNode)[direction];
      acc++;

      if (currentNode.charAt(2) === "Z") {
        return acc;
      }
    }
  });

  return result.reduce(lcm, first);
}

const result = main(args[0] ?? "./input/day8/2.test.txt");
console.log(result);
