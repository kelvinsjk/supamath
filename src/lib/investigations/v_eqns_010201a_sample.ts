import type { v_eqns_010201a } from '@prisma/client';
import { generateID } from '../../../prisma/generateID';
import { determinantFrac } from 'mathlify';
import fs from 'node:fs';

const vars: v_eqns_010201a[] = [];

let idx = 0;
for (const { a, b, c } of generateABC()) {
	for (const { x1 } of generateX1()) {
		for (const { x2 } of generateX2(x1)) {
			if (determinantFrac(x1*x1, x1, 1, x2*x2, x2, 1, 2*x1, 1, 0).isEqualTo(0)){
				console.log(x1,x2);
			}
			idx++;
			vars.push({
				a,
				b,
				c,
				x1,
				x2,
				id: generateID(a,b,c,x1,x2),
				idx,
				checked: false,
				flagged: false,
			});
		}
	}
}

console.log(vars.length);
// shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const var500 = vars.slice(0, 500).map((v)=>{return {a: v.a, b: v.b, c: v.c, x1: v.x1, x2: v.x2, id: v.id}});
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010201a_500.json`, JSON.stringify(var500));
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010201a.json`, JSON.stringify(vars));

function generateABC(): { a: number, b: number; c: number }[] {
	// a,c: plus/minus 1 to 5
	// b: plus/minus 0 to 5
	const abcArray: { a: number; b: number; c: number }[] = [];
	for (let i = 1; i < 6; i++) {
		for (let j = 0; j < 6; j++) {
			for (let k = 1; k < 6; k++) {
				abcArray.push(
					{a: i, b: j, c: k},
					{a: i, b: j, c: -k},
					{a: -i, b: j, c: k},
					{a: -i, b: j, c: -k},
				);
				if ( j !== 0){
					abcArray.push(
						{a: i,  b: -j, c: k},
						{a: i,  b: -j, c: -k},
						{a: -i, b: -j, c: k},
						{a: -i, b: -j, c: -k},
					);
				}
			}
		}
	}
	return abcArray;
}

function generateX1(): { x1: number }[] {
	// plus/minus 1 to 5
	const x1Array: { x1: number }[] = [];
	for (let x1 = 1; x1 < 6; x1++) {
		x1Array.push(
			{ x1 },
			{ x1: -x1 },
		);
	}
	return x1Array;
}

function generateX2(x1: number): { x2: number; }[] {
	// plus/minus 1 to 5 such that x1 \neq x2
	const x2Array: { x2: number; }[] = [];
	for (let x2 = 1; x2 < 6; x2++) {
		if (x1 !== x2) {
			x2Array.push({ x2 });
		}
		if (x1 !== -x2) {
			x2Array.push({ x2: -x2 });
		}
	}
	return x2Array;
}

