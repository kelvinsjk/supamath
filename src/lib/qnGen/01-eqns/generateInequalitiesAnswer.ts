import { math } from "mathlifier";
import type { Fraction } from "mathlify";

// generate inequalities answer for 3 roots
export function generateInequalitiesAnswer(a: number|Fraction, b: number|Fraction, c:number|Fraction, signCase=1): string {
  const roots = [a,b,c].sort((a,b)=>a.valueOf()-b.valueOf());
  return signCase===1 ?
    `${math(`${roots[0]} < x < ${roots[1]}`)} <span class="mx-4 inline-block">or</span> ${math(`x > ${roots[2]}`)}` :
    `${math(`x < ${roots[0]}`)} <span class="mx-4 inline-block">or</span> ${math(`${roots[1]} < x < ${roots[2]}`)}`;
}