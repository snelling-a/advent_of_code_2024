import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
const parsedInput = parseInput(rawInput).reduce<{
  left: number[];
  right: number[];
}>(
  (acc, line) => {
    const [a, b] = line.split(/\s+/);
    acc.left.push(parseInt(a));
    acc.right.push(parseInt(b));
    return acc;
  },
  { left: [], right: [] },
);

const right = parsedInput.right.sort();
const left = parsedInput.left.sort();

/** Your puzzle answer was 1970720. */
export function part1(): number {
  return left.reduce((acc, n, i) => {
    return acc + Math.abs(n - right[i]);
  }, 0);
}

/** Your puzzle answer was 17191599. */
export function part2(): number {
  return left.reduce((acc, n) => {
    const occurrences = right.filter((m) => m === n).length;

    return acc + n * occurrences;
  }, 0);
}
