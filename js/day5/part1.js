const fs = require("node:fs");
const args = process.argv.slice(2);

function parse(fileContent) {
  const seeds = fileContent.shift().split(":")[1].trim().split(" ").map(Number);
  const mappingConfig = fileContent.map((entry) => {
    return entry
      .split(":\n")[1]
      .split("\n")
      .map((row) => row.split(" ").map(Number));
  });

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
  const result = seeds.map((seed) => {
    return mappingPipeline.reduce((acc, mapper) => mapper(acc), seed);
  });

  return Math.min(...result);
}

const result = main(args[0] ?? "./input/day5/1.test.txt");
console.log(result);
