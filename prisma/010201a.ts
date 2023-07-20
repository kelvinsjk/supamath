import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import { determinantFrac } from 'mathlify';

const client = new PrismaClient();

const vars: Prisma.v_eqns_010201aCreateInput[] = [];

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
			});
		}
	}
}

console.log(vars.length);

const main = async () => {
	//await Promise.all(vars.map((v) => client.v_eqns_010201a.create({ data: v })));
	await client.v_eqns_010201a.createMany({data: vars});
};

main();

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

