import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);
const [rawPageOrderingRules, rawUpdates] = rawInput.split("\n\n");

const parsedPageOrderingRules = parseInput(rawPageOrderingRules).map((rule) =>
  rule.split(/\|/).map(Number),
) as [number, number][];

const rulesMap = new Map<number, Set<number>>();
for (const [before, after] of parsedPageOrderingRules) {
  if (!rulesMap.has(before)) {
    rulesMap.set(before, new Set());
  }

  rulesMap.get(before)!.add(after);
}

const parsedUpdates = parseInput(rawUpdates).map((update) =>
  update.split(/,/).map(Number),
) as [number, number][];

function isUpdateValid(
  update: number[],
  rules: Map<number, Set<number>>,
): boolean {
  const indexMap = new Map<number, number>();
  update.forEach((page, index) => indexMap.set(page, index));

  for (const [before, afterSet] of rules.entries()) {
    const beforePage = Number(before);

    if (!indexMap.has(beforePage)) continue;

    for (const afterPage of afterSet) {
      if (!indexMap.has(afterPage)) continue;

      if (indexMap.get(beforePage)! > indexMap.get(afterPage)!) {
        return false;
      }
    }
  }

  return true;
}

function findValidUpdates(): number[][] {
  return parsedUpdates.filter((update) => isUpdateValid(update, rulesMap));
}

function getMiddleValues(validUpdates: number[][]): number[] {
  return validUpdates.map((update) => {
    const middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
  });
}

function reorderUpdate(update: number[]): number[] {
  const graph: Record<number, Set<number>> = {};
  const inDegree: Record<number, number> = {};

  update.forEach((page) => {
    graph[page] = new Set();
    inDegree[page] = 0;
  });

  for (const [before, afterSet] of rulesMap.entries()) {
    const beforePage = Number(before);
    if (!update.includes(beforePage)) continue;

    for (const afterPage of afterSet) {
      if (!update.includes(afterPage)) continue;

      if (!graph[beforePage].has(afterPage)) {
        graph[beforePage].add(afterPage);
        inDegree[afterPage]++;
      }
    }
  }

  const sorted: number[] = [];
  const queue: number[] = Object.keys(inDegree)
    .filter((key) => inDegree[Number(key)] === 0)
    .map(Number);

  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);

    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (sorted.length !== update.length) {
    throw new Error("Cycle detected in rules");
  }

  return sorted;
}

function reorderInvalidUpdates() {
  return parsedUpdates
    .filter((update) => !isUpdateValid(update, rulesMap))
    .map((update) => reorderUpdate(update));
}

/** Your puzzle answer was 5166. */
export function part1() {
  const validUpdates = findValidUpdates();
  const middleValues = getMiddleValues(validUpdates);

  return middleValues.reduce((acc, val) => acc + val, 0);
}

/** Your puzzle answer was 4679. */
export function part2() {
  const reorderedUpdates = reorderInvalidUpdates();
  const middleValues = getMiddleValues(reorderedUpdates);

  return middleValues.reduce((acc, val) => acc + val, 0);
}
