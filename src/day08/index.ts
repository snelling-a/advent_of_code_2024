import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
const rawSampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

function parseInput(input: string) {
  return _parseInput(input).map((line) => line.split(""));
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput: ParsedInput = parseInput(rawInput);
const parsedSampleInput: ParsedInput = parseInput(rawSampleInput);

function solvePart1(input: ParsedInput) {
  return 0;
}
function solvePart2(input: ParsedInput) {
  return 0;
}

export function part1() {
  if (solvePart1(parsedSampleInput) === 14) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

export function part2() {
  if (solvePart2(parsedSampleInput) === 14) {
    return solvePart2(parsedInput);
  }

  return "nop";
}