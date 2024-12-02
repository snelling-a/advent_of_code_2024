import { parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync("./src/day01/input.txt");

const input = parseInput(rawInput).reduce<{ left: number[]; right: number[] }>(
  (acc, line) => {
    const [a, b] = line.split(/\s+/);
    acc.left.push(parseInt(a));
    acc.right.push(parseInt(b));
    return acc;
  },
  { left: [], right: [] },
);

export function part1() {
  const { left, right } = input;
  return left.reduce((acc, n, i) => {
    return acc + Math.abs(n - right[i]);
  }, 0);
}

export function part2() {
  const { left, right } = input;

  return left.reduce((acc, n) => {
    const occurrences = right.filter((m) => m === n).length;

    return acc + n * occurrences;
  }, 0);
}

// { solution1: 1970720, solution2: 17191599 }
