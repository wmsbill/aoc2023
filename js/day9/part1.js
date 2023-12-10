const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  return fileContent.map((line) => line.split(" ").map(Number));
}

function getDiffMatrix(sequence) {
  const diffList = [];
  let currentList = sequence;

  do {
    const newDiffList = [];
    for (let i = 1; i < currentList.length; i++) {
      newDiffList.push(currentList[i] - currentList[i - 1]);
    }

    diffList.push(newDiffList);
    currentList = newDiffList;
  } while (currentList.some((num) => num !== 0));

  return diffList;
}

function findNextSequence(sequence) {
  const num = getDiffMatrix(sequence)
    .reverse()
    .reduce((sum, item) => item[0] - sum, 0);

  return sequence[0] - num;
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n");
  const sequenceList = parse(fileContent);

  return sequenceList.map(findNextSequence).reduce((a, b) => a + b, 0);
}

const result = main(args[0] ?? "./input/day9/1.test.txt");
console.log(result);
