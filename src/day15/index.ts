import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  return _parseInput(input);
}

type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput = parseInput(rawInput);
const parsedSampleInput = parseInput(rawSampleInput);

function solvePart1(input: ParsedInput) {
  return 1;
}
function solvePart2(input: ParsedInput) {
  return 1;
}

/** Your puzzle answer was . */
export function part1() {
  if (solvePart1(parsedSampleInput) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was . */
export function part2() {
  if (solvePart2(parsedSampleInput) === sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
