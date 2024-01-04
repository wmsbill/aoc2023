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

function setLensOnBoxes(sequence, boxes) {
  const regex = /(.+)?(\W)(\d)?/g;

  for (let step of sequence) {
    const [[_, label, operation, focalLength]] = step.matchAll(regex);
    const index = hash(label);
    const box = boxes[index];

    if (operation === "-") {
      box.delete(label);
    }

    if (operation === "=") {
      box.set(label, Number(focalLength));
    }
  }

  return boxes;
}

function getFocusingPower(boxes) {
  let power = 0;

  for (let [index, box] of boxes.entries()) {
    const boxNum = index + 1;
    let slot = 1;

    for (let [, focalLength] of box) {
      power += boxNum * focalLength * slot;
      slot++;
    }
  }

  return power;
}

function main(file) {
  const sequence = fs.readFileSync(file, "utf8").split(",");
  const boxes = Array.from({ length: 256 }, () => new Map());

  return getFocusingPower(setLensOnBoxes(sequence, boxes));
}

const result = main(args[0] ?? "./input/day15/1.test.txt");
console.log(result);
