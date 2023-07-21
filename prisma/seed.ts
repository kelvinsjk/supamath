import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
import { bisection } from 'mathlify';

const client = new PrismaClient();

const vars: Prisma.v_eqns_010202CreateInput[] = [];

const maxX = [0, 0], maxY = [0,0];
const minX = [10, 10], minY = [10,10];

let idx = 0;
for (const { a, b } of generateAB()) {
	for (const { c } of generateC(a,b)) {
		for (const { signCase } of generateSign()) {
			idx++;
			vars.push({
				a,
				b,
				c,
				signCase,
				id: generateID(a,b,c,signCase),
				idx,
			});
			const x = bisection((x)=>Math.log(a*x)-c+b*x, 1/a, c/b);
			const y = Math.log(a*x);
			if (x > maxX[0]) {
				maxX[0] = x;
				maxX[1] = y;
			}
			if (x < minX[0]) {
				minX[0] = x;
				minX[1] = y;
			}
			if (y > maxY[1]) {
				maxY[0] = x;
				maxY[1] = y;
			}
			if (y < minY[1]) {
				minY[0] = x;
				minY[1] = y;
			}
		}
	}
}

console.log(vars.length, minX, maxX, minY, maxY);
// shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const vars500 = vars.slice(0, 500);
//fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010202_500.json`, JSON.stringify(vars500));
//fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010202.json`, JSON.stringify(vars));

const main = async () => {
	//await client.v_eqns_010202.createMany({data: vars500});
};

main();

function generateAB(): { a: number, b: number }[] {
	// a: 1-9
	// b: 1-5
	const abArray: { a: number, b: number }[] = [];
	for (let a = 1; a < 10; a++) {
		for (let b = 1; b < 6; b++) {
			abArray.push({ a, b },);
		}
	}
	return abArray;
}

function generateC(a: number, b: number): { c: number }[] {
	// c from floor(b/a + 1) to 9
	const cArray: { c: number }[] = [];
	for (let c = Math.floor(b/a + 1); c < 10; c++) {
		cArray.push({ c },);
	}
	return cArray;
}

function generateSign(): { signCase: number }[] {
	return [{ signCase: -1 }, { signCase: 1 }];
}