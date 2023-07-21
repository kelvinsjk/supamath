import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
import { gcd, solveQuadratic } from 'mathlify';

const client = new PrismaClient();

const vars: Prisma.v_eqns_010301CreateInput[] = [];

let min = 0, max = 0, j = 0, k = 0;

// (dx + e) / (x^2 + bx + c)
// b^2 - 4c < 0 to ensure denominator is always positive

let idx = 0;
for (const { c, d } of generateCD()) {
	for (const { b } of generateB(c)) {
		for (const {e} of generateE(d)){
			for (const { canTake } of generateCanTake()) {
				const algebraic = Math.random() < 0.5;
				idx++;
				vars.push({
					b,
					c,
					d,
					e,
					canTake,
					algebraic,
					id: generateID(b,c,d,e,canTake,algebraic),
					idx,
				});
				const A = b*b - 4*c;
				const B = 4*e-2*b*d;
				const C = d*d;
				let [x1, x2, xType] = solveQuadratic([A,B,C]);
				if (xType !== 'frac'){
					k++;
					// 84.1% of the time we have surd solutions
				}
				if (x1.valueOf() > x2.valueOf()) {
					[x1, x2] = [x2, x1];
				}
				if (x1.valueOf() < min) {
					min = x1.valueOf();
				}
				if (x2.valueOf() > max) {
					max = x2.valueOf();
				}
				if (x1.valueOf()< -10 || x2.valueOf() > 10 ){
					j++;
				}
			}
		}
	}
}

console.log(vars.length, min, max, j, k, (k/vars.length).toPrecision(3));
// shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const vars500 = vars.slice(0, 500);
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010301_500.json`, JSON.stringify(vars500));
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010301.json`, JSON.stringify(vars));

const main = async () => {
	await client.v_eqns_010301.createMany({data: vars});
};

main();

function generateCD(): { c: number, d: number }[] {
	// c: 1-9
	// d: 1-3
	const cdArray: { c: number, d: number }[] = [];
	for (let c = 1; c < 10; c++) {
		for (let d = 1; d < 4; d++) {
			cdArray.push({ c, d },{c, d:-d});
		}
	}
	return cdArray;
}

function generateB(c: number): { b: number }[] {
	// b: 1 to min(9, sqrt(4c-1))
	const bArray: { b: number }[] = [];
	for (let b = 1; b < Math.min(10, Math.floor(Math.sqrt(4*c))); b++) {
		bArray.push({ b }, {b: -b});
	}
	return bArray;
}

function generateE(d: number): { e: number }[] {
	// e: 1 to 9
	const eArray: { e: number }[] = [];
	for (let e = 1; e < 10; e++) {
		if (gcd(e,d) !==1){
			eArray.push({e});
			if (d > 0){
				eArray.push({e:-e});
			}
		}
	}
	return eArray;
}

function generateCanTake(): { canTake: boolean }[] {
	return [{ canTake: true }, { canTake: false }];
}