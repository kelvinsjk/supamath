import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
const client = new PrismaClient();

//! change below
const table = 'v_eqns_010302';
const vars: Prisma.v_eqns_010302CreateInput[] = [];
//! change above

// | ax + b | sign cx + d
// sign: 0: <, 1: <=, 2: >, 3: >=
// a: 1-3, b: 1-5, ++, +-, -+
// k: 9 if a=1, 4 if a=2, 3 if a=3
// x1 left of -b/a such that x1 >= max(-9, ceil(-b/a - k))
// x2 right of -b/a such that x2 <= min(9, floor(-b/a + k))
// c is gradient of line (x1, y1), (x2, y2)
// d is y-intercept of line (x1, y1), (x2, y2) 

let idx = 0;
for (const { a, b } of generateAB()) {
	for (const { x1, x2 } of generateX(a, b)) {
		for (const { signCase } of generateSign()) {
			idx++;
			const id = generateID(a, b, x1, x2, signCase);
			vars.push({
				a,
				b,
				x1,
				x2,
				signCase,
				id,
				idx,
			});
		}
	}
}

console.log(vars.length);
//! shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const vars500 = vars.slice(0, 500);
fs.writeFileSync(`./src/lib/investigations/jsons/${table}_500.json`, JSON.stringify(vars500));
fs.writeFileSync(`./src/lib/investigations/jsons/${table}.json`, JSON.stringify(vars));

const main = async () => {
	await client[table].createMany({ data: vars500 });
	//await client.v_eqns_010301.createMany({ data: vars });
};

main();

function generateAB(): { a: number; b: number }[] {
	// a: 1 to 3
	// b: 1 to 5
	// ++, +-, -+
	const abArray: { a: number; b: number }[] = [];
	for (let a = 1; a < 4; a++) {
		for (let b = 1; b < 6; b++) {
			abArray.push({ a, b }, { a, b: -b }, {a: -a, b});
		}
	}
	return abArray;
}

function generateX(a: number, b: number): { x1: number, x2: number }[] {
	// k: 9 if a=1, 4 if a=2, 3 if a=3
	// x1: left of -b/a such that x1 >= max(-9, ceil(-b/a - k))
	// x2: right of -b/a such that x2 <= min(9, floor(-b/a + k))
	const k = a === 1 ? 9 : a === 2 ? 4 : 3;
	const x1Lower = Math.max(-9, Math.ceil(-b / a - k));
	const x2Upper = Math.min(9, Math.floor(-b / a + k));
	const xArray: { x1: number, x2: number }[] = [];
	for (let x1 = x1Lower; x1 <= Math.ceil(-b/a-1); x1++) {
		for (let x2 = Math.floor(-b/a+1); x2 <= x2Upper; x2++) {
			xArray.push({ x1, x2 });
		}
	}
	return xArray;
}

function generateSign(): { signCase: number }[] {
	// sign: 0: <, 1: <=, 2: >, 3: >=
	const signArray: { signCase: number }[] = [];
	for (let signCase = 0; signCase < 4; signCase++) {
		signArray.push({ signCase });
	}
	return signArray;
}
