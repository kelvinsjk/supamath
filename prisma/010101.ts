import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';

const client = new PrismaClient();

const vars: Prisma.v_inequalities_exampleCreateInput[] = [];

let idx = 0;
for (const { c, d } of generateCD()) {
	for (const { a, b } of generateAB(c, d)) {
		for (const { B } of generateB()) {
			for (const { signCase } of generateSign()) {
				idx++;
				vars.push({
					a,
					b,
					c,
					d,
					B,
					signCase,
					id: generateID(a, b, c, d, B, signCase),
					idx
				});
			}
		}
	}
}

console.log(`Generated ${vars.length} variables.`)


const main = async () => {
	await Promise.all(vars.map((v) => client.v_inequalities_example.create({ data: v })));
};

main();

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
	// a: 1, b: 1-3
	// a: 2, b: 1,3
	// all permuted with (+,+), (+,-), (-,+) where b/a \neq c or d 
	const abArray: { a: number; b: number }[] = [];
	for (let i = 1; i < 4; i++) { // b
		for (let j = 1; j < 2; j++) { // a
			for (let k = 0; k < 3; k++) { // sign
				const a = k===2 ? -j : j;
				const b = k===1 ? -i : i;
				if (b/a !== c && b/a !== d && (a===1 || b%a !== 0)) {
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
