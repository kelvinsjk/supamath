import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import { determinantFrac } from 'mathlify';
import fs from 'node:fs';

const client = new PrismaClient();

const vars: Prisma.v_eqns_010201bCreateInput[] = [];

let idx = 0;
let j = 0;
for (const { x1, x2, x3 } of generateX()) {
	for (const { a1, b1, c1 } of generateABC()) {
		for (const { a2, b2, c2 } of generateABC2()) {
			if (determinantFrac(1, 1, 1, a1, b1, c1, a2, b2, c2).isEqualTo(0)){
				//console.log(x1,x2,x3,a1,b1,c1,a2,b2,c2,j);
				j++;
			} else {
				idx++;
				vars.push({
					a1,
					b1,
					c1,
					a2,
					b2,
					c2,
					x1,
					x2,
					x3,
					id: generateID(a1,b1,c1,a2,b2,c2,x1,x2,x3),
					idx,
				});
			}
		}
	}
}

console.log(vars.length, j);
// shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const vars500 = vars.slice(0, 500);
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010201b_500.json`, JSON.stringify(vars500));
//fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010201b.json`, JSON.stringify(vars));

const main = async () => {
	await client.v_eqns_010201b.createMany({data: vars500});
};

main();

function generateX(): { x1: number, x2: number; x3: number }[] {
	// 1-8 such that all three add up to at most 10
	const xArray: { x1: number; x2: number; x3: number }[] = [];
	for (let i = 1; i < 9; i++) {
		for (let j = 1; j <= 9-i; j++) {
			for (let k = 1; k <= 10-j-i; k++) {
				xArray.push(
					{x1: i, x2: j, x3: k},
				);
			}
		}
	}
	return xArray;
}

function generateABC(): { a1: number, b1: number, c1: number }[] {
	// 10-15: $5.00 to $7.50
	// 12-17: $6.00 to $8.50
	// 13-18: $6.50 to $9.00
	const abcArray: { a1: number, b1: number, c1: number }[] = [];
	for (let a1 = 10; a1 <= 15; a1++) {
		for (let b1 = 12; b1 <= 17; b1++) {
			for (let c1 = 13; c1 <= 18; c1++) {
				abcArray.push({ a1, b1, c1 },);
			}
		}
	}
	return abcArray;
}

function generateABC2(): { a2: number, b2: number, c2: number }[] {
	// 11-16: $5.50 to $8.00
	// 15-20: $7.50 to $10.00
	// 10-15: $5.00 to $7.50
	const abcArray: { a2: number, b2: number, c2: number }[] = [];
	for (let a2 = 11; a2 <= 16; a2++) {
		for (let b2 = 15; b2 <= 20; b2++) {
			for (let c2 = 10; c2 <= 15; c2++) {
				abcArray.push({ a2, b2, c2 },);
			}
		}
	}
	return abcArray;
}
