import { rawSampleInput, sampleSolutions } from "./sampleInput.ts";
import { parseInput as _parseInput } from "../utils/parseInput.ts";

const rawInput = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
function parseInput(input: string) {
  const [rawRegisters, rawProgram] = input.trim().split(/\n\n/);
  const registers = (rawRegisters.split(/\n/)).reduce<
    { A: number; B: number; C: number }
  >(
    (acc, cur) => {
      const [, name, value] = cur.match(
        /Register (\w): (\d+)/,
      ) || [];

      acc[name as "A" | "B" | "C"] = parseInt(value);
      return acc;
    },
    { A: 0, B: 0, C: 0 },
  );

  const program = rawProgram.split(/\s/)[1].split(",").map(Number);

  return { registers, program };
}
type ParsedInput = ReturnType<typeof parseInput>;

const parsedInput: ParsedInput = parseInput(rawInput);
const parsedSampleInputPart1: ParsedInput = parseInput(rawSampleInput.part1);
const parsedSampleInputPart2: ParsedInput = parseInput(rawSampleInput.part2);

function runProgram(
  { registers, program }: ParsedInput,
) {
  const outputs: number[] = [];
  let pointer = 0;

  const getComboValue = (operand: number) => {
    if (operand <= 3) {
      return operand;
    }
    if (operand === 4) {
      return registers.A;
    }
    if (operand === 5) {
      return registers.B;
    }
    if (operand === 6) {
      return registers.C;
    }
    throw new Error("Invalid combo operand");
  };

  while (pointer < program.length) {
    const opcode = program[pointer];
    const operand = program[pointer + 1];
    switch (opcode) {
      case 0: // adv: A divided by 2^operand
        registers.A = Math.trunc(
          registers.A / Math.pow(2, getComboValue(operand)),
        );
        break;
      case 1: // bxl: B xor operand
        registers.B ^= operand;
        break;
      case 2: // bst: B set to combo value
        registers.B = getComboValue(operand) % 8;
        break;
      case 3: // jnz: Jump to operand if A is not zero
        if (registers.A !== 0) {
          pointer = operand;
          continue;
        }
        break;
      case 4: // bxc: bitwise xor B and C
        registers.B ^= registers.C;
        break;
      case 5: // out: output combo value
        outputs.push(getComboValue(operand) % 8);
        break;
      case 6: // bdv: B divided by 2^operand
        registers.B = Math.trunc(
          registers.A / Math.pow(2, getComboValue(operand)),
        );
        break;
      case 7: // cdv C divided by 2^operand
        registers.C = Math.trunc(
          registers.A / Math.pow(2, getComboValue(operand)),
        );
        break;
      default:
        throw new Error(`Invalid opcode: ${opcode}`);
    }
    pointer += 2;
  }

  return outputs.join(",");
}

function solvePart1(input: ParsedInput) {
  return runProgram(input);
}
function solvePart2(input: ParsedInput) {
  return 1;
}

/** Your puzzle answer was 1,5,0,1,7,4,1,0,3. */
export function part1() {
  if (solvePart1(parsedSampleInputPart1) === sampleSolutions.part1) {
    return solvePart1(parsedInput);
  }

  return "nop";
}

/** Your puzzle answer was . */
export function part2() {
  if (solvePart2(parsedSampleInputPart2) === sampleSolutions.part2) {
    return solvePart2(parsedInput);
  }

  return "nop";
}
