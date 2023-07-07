import type { v_inequalities_example } from '@prisma/client';
import { generateID } from '../../../prisma/generateID';

const vars: v_inequalities_example[] = [];
const exceptionIDs: string[] = [];
let max = 0;

let idx = 0;
for (const { c, d } of generateCD()) {
	for (const { a, b } of generateAB(c, d)) {
		for (const { B } of generateB()) {
			for (const { signCase } of generateSign()) {
				idx++;
        const C = B + a*d - b - a*c;
        const D = b*c - B*d;
        const flagged = (Math.abs(C)>9)||(Math.abs(D)>9)
        const id = generateID(a, b, c, d, B, signCase)
				vars.push({
					a,
					b,
					c,
					d,
					B,
					signCase,
					id,
					idx,
          checked: false,
          flagged,
				});
        if (flagged) {
          exceptionIDs.push(id);
          console.log(C,D)
          max = Math.max(max, Math.abs(C), Math.abs(D));
        }
			}
		}
	}
}

console.log(exceptionIDs.length, vars.length, max, exceptionIDs.length/vars.length);

/**
 * save exceptionArray to JSON file
 */
import fs from 'fs';
fs.writeFileSync(`./src/lib/investigations/jsons/v_inequalities_example.json`, JSON.stringify(vars));
fs.writeFileSync(`./src/lib/investigations/jsons/v_inequalities_exampleExceptions.json`, JSON.stringify(exceptionIDs));

function generateCD(): { c: number; d: number }[] {
	// unique integers from -3 to 3
	const cdArray: { c: number; d: number }[] = [];
	for (let i = -3; i < 4; i++) {
		for (let j = -3; j < 4; j++) {
			if (j !== i) {
				cdArray.push({ c: i, d: j });
			}
		}
	}
	return cdArray;
}
function generateAB(c: number, d: number): { a: number; b: number }[] {
	// a: 1-2, b: 1-3, permuted with (+,+), (+,-), (-,+) where b/a \neq c or d 
	const abArray: { a: number; b: number }[] = [];
	for (let i = 1; i < 4; i++) { // b
		for (let j = 1; j < 2; j++) { // a
			for (let k = 0; k < 3; k++) { // sign
				const a = k===2 ? -j : j;
				const b = k===1 ? -i : i;
				if (b/a !== c && b/a !== d) {
					abArray.push({ a, b });
				}
			}
		}
	}
	return abArray;
}
function generateB(): { B: number }[] {
	return [{ B: 1 }, { B: 2 }];
}
function generateSign(): { signCase: number }[] {
	return [{ signCase: -1 }, { signCase: 1 },];
}
