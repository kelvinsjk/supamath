import { PrismaClient, Prisma } from '@prisma/client';

const client = new PrismaClient();

const vars: Prisma.v2022p1q1CreateInput[] = [];
for (const { a, b } of generateAB()) {
	for (const { x1, y2 } of generateX1Y2(a, b)) {
		for (const { y1 } of generateY1(x1)) {
			for (const { x2 } of generateX2(y2)) {
				for (const { x3, y3 } of generateAlpha()) {
					for (const { b2 } of generateB2(b)) {
						const og =
							a === 1 &&
							b === 2 &&
							x1 === 2 &&
							y1 === 1 &&
							x2 === 0 &&
							y2 === -1 &&
							x3 === 2 &&
							y3 === -1 &&
							b2 === 1;
						vars.push({
							a,
							b,
							x1,
							y1,
							x2,
							y2,
							x3,
							y3,
							b2,
							id: `id${a}${b}${x1}${y1}${x2}${y2}${x3}${y3}${b2}`,
							og
						});
					}
				}
			}
		}
	}
}

const main = async () => {
	const v2022p1q1 = await Promise.all(vars.map((v) => client.v2022p1q1.create({ data: v })));
};

main();

function generateAB(): { a: number; b: number }[] {
	// (1,2), (1,3), (2,3) permutate with ++,+-,-+
	const abArray: { a: number; b: number }[] = [];
	for (let i = 0; i < 3; i++) {
		let a = i === 2 ? 2 : 1;
		let b = i === 0 ? 2 : 3;
		for (let j = 0; j < 3; j++) {
			if (j === 1) {
				b = -b;
			} else if (j === 2) {
				a = -a;
			}
			abArray.push({ a, b });
		}
	}
	return abArray;
}
function generateX1Y2(a: number, b: number): { x1: number; y2: number }[] {
	const xyArray: { x1: number; y2: number }[] = [];
	for (let i = 0; i < 2; i++) {
		const x1 = i === 0 ? b : -b;
		const y2 = i === 0 ? -a : a;
		xyArray.push({ x1, y2 });
	}
	return xyArray;
}
function generateY1(x1: number): { y1: number }[] {
	const y1Array: { y1: number }[] = [{ y1: 1 }, { y1: -1 }];
	if (Math.abs(x1) === 3) {
		y1Array.push({ y1: -2 }, { y1: 2 });
	}
	return y1Array;
}
function generateX2(y2: number): { x2: number }[] {
	const x2Array: { x2: number }[] = [{ x2: 1 }, { x2: -1 }];
	if (Math.abs(y2) === 1) {
		x2Array.push({ x2: 0 }, { x2: 2 }, { x2: -2 });
	}
	return x2Array;
}
function generateAlpha(): { x3: number; y3: number }[] {
	// (1,1), (1,2), (2,1) permutate with ++,+-,-+
	const alphaArray: { x3: number; y3: number }[] = [];
	for (let i = 0; i < 3; i++) {
		let x3 = i === 2 ? 2 : 1;
		let y3 = i === 1 ? 2 : 1;
		for (let j = 0; j < 3; j++) {
			if (j === 1) {
				y3 = -y3;
			} else if (j === 2) {
				x3 = -x3;
			}
			alphaArray.push({ x3, y3 });
		}
	}
	return alphaArray;
}
function generateB2(b: number): { b2: number }[] {
	const b2Array: { b2: number }[] = [{ b2: 1 }, { b2: -1 }];
	if (Math.abs(b) === 3) {
		b2Array.push({ b2: 2 }, { b2: -2 });
	}
	return b2Array;
}
