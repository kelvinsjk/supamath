import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';

const client = new PrismaClient();

const vars: Prisma.v_eqns_010202CreateInput[] = [];

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
		}
	}
}

console.log(vars.length);
// shuffle vars with Fisher-Yates algorithm
for (let i = vars.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars[i], vars[j]] = [vars[j], vars[i]];
}
const vars500 = vars.slice(0, 500);
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010202_500.json`, JSON.stringify(vars500));
fs.writeFileSync(`./src/lib/investigations/jsons/v_eqns_010202.json`, JSON.stringify(vars));

const main = async () => {
	await client.v_eqns_010202.createMany({data: vars500});
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