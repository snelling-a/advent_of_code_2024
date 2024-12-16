import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  return input.trim().split(" ");
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput: ParsedInput = parseInput(rawInput);
const parsedSampleInput: ParsedInput = parseInput(rawSampleInput);

function splitString(str: string) {
  const mid = Math.floor(str.length / 2);

  return [str.slice(0, mid), str.slice(mid)];
}

function trimLeadingZeroes(str: string) {
  const trimmed = str.replace(/^0+/, "");

  return trimmed === "" ? "0" : trimmed;
}

function multiplyBy2024(str: string) {
  return String(parseInt(str, 10) * 2024);
}

function runSimulation(stones: ParsedInput, iterations: number) {
  let stoneCounts = new Map<string, number>();

  for (const stone of stones) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let i = 0; i < iterations; i++) {
    const newStoneCounts = new Map<string, number>();

    for (const [stone, count] of stoneCounts.entries()) {
      if (stone === "0") {
        newStoneCounts.set("1", (newStoneCounts.get("1") || 0) + count);
        continue;
      }

      if (stone.length % 2 === 0) {
        const [left, right] = splitString(stone);
        const trimmedLeft = trimLeadingZeroes(left);
        const trimmedRight = trimLeadingZeroes(right);

        newStoneCounts.set(
          trimmedLeft,
          (newStoneCounts.get(trimmedLeft) || 0) + count,
        );
        newStoneCounts.set(
          trimmedRight,
          (newStoneCounts.get(trimmedRight) || 0) + count,
        );
        continue;
      }

      const multiplied = multiplyBy2024(stone);
      newStoneCounts.set(
        multiplied,
        (newStoneCounts.get(multiplied) || 0) + count,
      );
    }

    stoneCounts = newStoneCounts;
  }

  return Array.from(stoneCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
}

function solvePart1(input: ParsedInput) {
  return runSimulation(input, 25);
}
function solvePart2(input: ParsedInput) {
  return runSimulation(input, 75);
}

/** Your puzzle answer was 213625. */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was 252442982856820. */
export function part2() {
  if (solvePart2(parsedSampleInput) !== sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
