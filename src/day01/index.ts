const rawInput = Deno.readTextFileSync("./src/day01/input.txt");
function parseInput(input: string) {
  const parsed = input
    .trim()
    .split("\n")
    .reduce<{ left: number[]; right: number[] }>(
      (acc, line) => {
        const [a, b] = line.split(/\s+/);
        acc.left.push(parseInt(a));
        acc.right.push(parseInt(b));
        return acc;
      },
      { left: [], right: [] },
    );

  return { left: parsed.left.sort(), right: parsed.right.sort() };
}

const input = parseInput(rawInput);

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
