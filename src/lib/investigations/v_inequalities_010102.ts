import type { v_inequalities_010102 } from '@prisma/client';
import { generateID } from '../../../prisma/generateID';
import { gcd } from 'mathlify';

const vars: v_inequalities_010102[] = [];

let idx = 0;
for (const { b } of generateB()) {
	for (const { c } of generateC(b)) {
		for (const { d, e } of generateDE()) {
			for (const { signCase } of generateSign()) {
				idx++;
				vars.push({
					b,
					c,
					d,
					e,
					signCase,
					id: generateID(b, c, d, e, signCase),
					idx,
					checked: false,
					flagged: false,
				});
			}
		}
	}
}

function generateB(): { b: number }[] {
	// plus/minus 1 to 8
	const bArray: { b: number }[] = [];
	for (let i = 1; i < 9; i++) {
		bArray.push({ b: i }, { b: -i });
	}
	return bArray;
}

function generateC(b: number): { c: number }[] {
	// 1 to max(1, floor(b^2/4 + 1))
	const cArray: { c: number }[] = [];
	for (let c = Math.max(1, Math.floor((b * b) / 4 + 1)); c < 18; c++) {
		cArray.push({ c });
	}
	return cArray;
}

function generateDE(): { d: number; e: number }[] {
	// d from 1 to 3
	// e from 1 to 9 such that gcd(d,e)==1
	// permute with signs (+,+), (+,-), (-,+)
	const deArray: { d: number; e: number }[] = [];
	for (let i = 1; i < 4; i++) {
		for (let j = 1; j < 10; j++) {
			if (gcd(i, j) === 1) {
				deArray.push({ d: i, e: j }, { d: i, e: -j }, { d: -i, e: j });
			}
		}
	}
	return deArray;
}

function generateSign(): { signCase: number }[] {
	return [{ signCase: -1 }, { signCase: 1 }];
}

import fs from 'fs';
fs.writeFileSync(`./src/lib/investigations/jsons/v_inequalities_010102.json`, JSON.stringify(vars));
