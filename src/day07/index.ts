import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { parseInput } from "../utils/parseInput.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const rawInput = Deno.readTextFileSync(`${__dirname}/input.txt`);

const parsedInput = parseInput(rawInput).map((line) => {
  const [testValue, numbers] = line.split(":").map((part) => part.trim());
  return {
    testValue: parseInt(testValue, 10),
    numbers: numbers.split(" ").map((num) => parseInt(num, 10)),
  };
});

const memo = new Map<string, number>();

function evaluateExpression(expression: string): number {
  let tokens = expression.split(/(\+|\*|\|\|)/);
  tokens = tokens.filter(Boolean);

  let result = parseInt(tokens[0], 10);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = tokens[i + 1];

    if (operator === "+") {
      result += parseInt(operand, 10);
    } else if (operator === "*") {
      result *= parseInt(operand, 10);
    } else if (operator === "||") {
      result = parseInt(result.toString() + operand, 10);
    }
  }

  return result;
}

const baseOperators = ["+", "*"];

function sumValidTestValues(operators = baseOperators) {
  let sum = 0;

  for (const { numbers, testValue } of parsedInput) {
    const key = JSON.stringify(numbers);
    if (memo.has(key)) {
      sum += testValue;
      continue;
    }

    const numOperators = numbers.length - 1;

    const combinations = Array.from({ length: 3 ** numOperators }, (_, i) => {
      const combo = [];
      let temp = i;
      for (let j = 0; j < numOperators; j++) {
        combo.unshift(operators[temp % 3]);
        temp = Math.floor(temp / 3);
      }
      return combo;
    });

    const expressions = combinations.map((opCombo) =>
      numbers.reduce(
        (expr, num, idx) => expr + (idx > 0 ? opCombo[idx - 1] : "") + num,
        "",
      ),
    );
    if (expressions.some((expr) => evaluateExpression(expr) === testValue)) {
      sum += testValue;

      memo.set(key, testValue);
    }
  }

  return sum;
}

/** Your puzzle answer was 850435817339. */
export function part1() {
  return sumValidTestValues();
}

/** Your puzzle answer was 104824810233437. */
export function part2() {
  return sumValidTestValues([...baseOperators, "||"]);
}
