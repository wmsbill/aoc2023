const fs = require("node:fs");
const args = process.argv.slice(2);

function* range(start, size) {
  for (let i = start; i < start + size; i++) {
    yield i;
  }
}

function parse(fileContent) {
  const seedConfig = fileContent
    .shift()
    .split(":")[1]
    .trim()
    .split(" ")
    .map(Number);
  const mappingConfig = fileContent.map((entry) => {
    return entry
      .split(":\n")[1]
      .split("\n")
      .map((row) => row.split(" ").map(Number));
  });

  const seeds = [];
  while (seedConfig.length) {
    seeds.push([seedConfig.shift(), seedConfig.shift()]);
  }

  return [seeds, mappingConfig];
}

function createMappingPipeline(configList) {
  const pipeline = configList.map(([to, from, range]) => (num) => {
    const rangeEnd = from + range - 1;

    if (num >= from && num <= rangeEnd) {
      return to + (num - from);
    }
  });

  return (num) => {
    for (const mapper of pipeline) {
      const result = mapper(num);
      if (result !== undefined) {
        return result;
      }
    }

    return num;
  };
}

function main(file) {
  const fileContent = fs.readFileSync(file, "utf8").split("\n\n");
  const [seeds, mappingConfig] = parse(fileContent);
  const mappingPipeline = mappingConfig.map(createMappingPipeline);
  let minVal = Number.MAX_SAFE_INTEGER;

  for (const [seed, seedEnd] of seeds) {
    for (const num of range(seed, seedEnd)) {
      const result = mappingPipeline.reduce((acc, mapper) => mapper(acc), num);
      minVal = Math.min(minVal, result);
    }
  }

  return minVal;
}

// Run it and take a coffee ;)
const result = main(args[0] ?? "./input/day5/1.test.txt");
console.log(result);
