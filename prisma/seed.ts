import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
import { getRandomInt } from 'mathlify';
import { shuffle } from './shuffle';
const client = new PrismaClient();

//! change below
const table = 'v_int_090201';
const vars: Prisma.v_int_090201CreateInput[] = [];
//! change above

// case 1: f'(x) / f(x)
// 0: ln x, 1: x^a + b, 2: ax^2 + bx + c
// case 2: f'(x) ( f(x) )^n
// 0: ln x, 1: x^a + b, 2: trig
// case 3: f'(x) exp( f(x) )
// 1: x^a + b, 2: trig

// we first get 200 rows where we have 1/(x ln x)
let idx = 0;
let count = 0;
for (const [a1,b1] of generateABs()) {
	for (const [a2,b2] of generateABs()) {
		for (const [a3,b3] of generateABs()) {
			for (const [a4,b4] of generateABs()) {
				count++;
				if (bsValid(b1,b2,b3,b4)&&asValid(a1,a2,a3,a4)){
					idx++;
					const swap1 = Math.random() < 0.5;
					const permute = getRandomInt(0,23);
					vars.push({
						a1,
						b1,
						swap1,
						a2,
						b2,
						a3,
						b3,
						a4,
						b4,
						permute,
						idx,
						id: generateID(a1,b1,swap1,a2,b2,a3,b3,a4,b4,permute)
					})
				}
			}
		}
	}
}
console.log(vars.length, count);

//! shuffle vars with Fisher-Yates algorithm
//for (let i = vars.length - 1; i > 0; i--) {
//	const j = Math.floor(Math.random() * (i + 1));
//	[vars[i], vars[j]] = [vars[j], vars[i]];
//}
shuffle(vars);
//! create sample of 500
const vars500 = vars.slice(0, 500);

fs.writeFileSync(`./src/lib/investigations/jsons/${table}_500.json`, JSON.stringify(vars500));
//fs.writeFileSync(`./src/lib/investigations/jsons/${table}.json`, JSON.stringify(vars));

const main = async () => {
	await client[table].createMany({ data: vars500 });
	//await client.v_eqns_010301.createMany({ data: vars });
};

main();

// first generating set
function generateABs(): [number, number][] {
	const abs: [number, number][] = [];
	// non-perfect squares, b=1
	for (const a of [2,3,5,6,7,10,11,13,15]){
		abs.push([a,1])
	}
	// perfect squares, b = 1
	const squares = [1,4,9,16,25,36,49,64,81];
	for (const a of squares){
		abs.push([a,1])
	}
	// perfect squares, b not 1
	const as = {
		'2': [1,9,25,49,81],
		'3': [1,4,16,25,49],
		'4': [1,4,9,25,49],
		'5': [1,4,9,16,36],
		'7': [1,4,9,16,25],
	} as const;
	const bs = ['2','3','4','5','7'] as const;
	for (const b of bs){
		for (const a of as[b]){
			abs.push([a,Number(b)])
		}
	}
	return abs;
}

function bsValid(b1: number, b2: number, b3: number, b4: number): boolean {
	if (b1===1 && b2===1 && b3===1 && b4===1) return false;
	if (b1!==1 && b2!==1 && b3!==1 && b4!==1) return false;
	return true;
}

function asValid(a1: number, a2: number, a3: number, a4: number): boolean {
	if (Number.isInteger(Math.sqrt(a1)) && Number.isInteger(Math.sqrt(a2)) && Number.isInteger(Math.sqrt(a3)) && Number.isInteger(Math.sqrt(a4))) return false; 
	if (!Number.isInteger(Math.sqrt(a1)) && !Number.isInteger(Math.sqrt(a2)) && !Number.isInteger(Math.sqrt(a3)) && !Number.isInteger(Math.sqrt(a4))) return false;
	return true;
}

