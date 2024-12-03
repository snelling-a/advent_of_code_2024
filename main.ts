import { part1, part2 } from "./src/day03/index.ts";

const newLocal = part1();
const newLocal_1 = part2();

const solution = `
part1: ${newLocal}
${newLocal_1 ? `-----\npart2: ${newLocal_1}` : ""}
`;

console.log(solution);
