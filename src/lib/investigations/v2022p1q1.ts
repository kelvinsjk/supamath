import { Complex } from 'mathlify';

type Variables = {a: number, b: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, b2: number, id: string, bigAbs: number}
const vars: Variables[] = [];
const exceptionIDs: string[] = [];
let max = 0;

for (const { a, b } of generateAB()) {
	for (const { x1, y2 } of generateX1Y2(a, b)) {
		for (const { y1 } of generateY1(x1)) {
			for (const { x2 } of generateX2(y2)) {
				for (const { x3, y3 } of generateAlpha()) {
					for (const { b2 } of generateB2(b)) {
						const id = `id${a}${b}${x1}${y1}${x2}${y2}${x3}${y3}${b2}`;
							const a1 = new Complex(0, a);
							const b1 = new Complex(b);
							//const c1 = new Complex(-1);
							const a2 = new Complex(x3, y3);
							const b2i = new Complex(0, b2);
							//const c2 = new Complex(6);

							//// answers
							const z = new Complex(x1, y1);
							const w = new Complex(x2, y2);

							//// generate c1, c2
							const c1 = a1.times(z).plus(b1.times(w));
							const c2 = a2.times(z).plus(b2i.times(w));
							
							const bigAbs = (c1.real.abs().isGreaterThan(9) || c1.imag.abs().isGreaterThan(9) || c2.real.abs().isGreaterThan(9) || c2.imag.abs().isGreaterThan(9));
							
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
								id,
								bigAbs: bigAbs ? 1 : 0,
							});
							if (bigAbs){
								exceptionIDs.push(id);
								max = Math.max(max, c1.real.abs().valueOf(), c1.imag.abs().valueOf(), c2.real.abs().valueOf(), c2.imag.abs().valueOf());
							}
					}
				}
			}
		}
	}
}

console.log(max);

/**
 * save exceptionArray to JSON file
 */
import fs from 'fs';
fs.writeFileSync(`./src/lib/investigations/v2022p1q1.json`, JSON.stringify(vars));
fs.writeFileSync(`./src/lib/investigations/v2022p1q1Exceptions.json`, JSON.stringify(exceptionIDs));

function generateAB(): { a: number; b: number }[] {
	// (1,2), (1,3), (2,3) permute with ++,+-,-+
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
	// (1,1), (1,2), (2,1) permute with ++,+-,-+
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
