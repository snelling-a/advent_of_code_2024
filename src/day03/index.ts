import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
const parsedInput = parseInput(rawInput).join();

const digitRegex = /\d{1,3}/;

function getInstructions(
  regexp: RegExp,
): RegExpStringIterator<RegExpExecArray> {
  return parsedInput.matchAll(regexp);
}

function multiply2Strings(a: string, b: string): number {
  return parseInt(a) * parseInt(b);
}

/** Your puzzle answer was 170778545. */
export function part1(): number {
  let result = 0;

  const regexp = new RegExp(
    `mul\\((${digitRegex.source}),(${digitRegex.source})\\)`,
    "g",
  );

  for (const [_, a, b] of getInstructions(regexp)) {
    result += multiply2Strings(a, b);
  }

  return result;
}

/** Your puzzle answer was 82868252. */
export function part2(): number {
  let result = 0;
  let enable = true;

  const regexp = new RegExp(
    `mul\\((${digitRegex.source}),(${digitRegex.source})\\)|do\\(\\)|don't\\(\\)`,
    "g",
  );

  for (const [what, a, b] of getInstructions(regexp)) {
    if (what === "do()") {
      enable = true;
    } else if (what === "don't()") {
      enable = false;
    } else if (enable) {
      result += multiply2Strings(a, b);
    }
  }

  return result;
}
