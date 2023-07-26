import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
import { getRandomInt } from 'mathlify';
const client = new PrismaClient();

//! change below
const table = 'v_int_090101';
let vars200: Prisma.v_int_090101CreateInput[] = [];
let vars300: Prisma.v_int_090101CreateInput[] = [];
//! change above

// case 1: f'(x) / f(x)
// 0: ln x, 1: x^a + b, 2: ax^2 + bx + c
// case 2: f'(x) ( f(x) )^n
// 0: ln x, 1: x^a + b, 2: trig
// case 3: f'(x) exp( f(x) )
// 1: x^a + b, 2: trig

// we first get 200 rows where we have 1/(x ln x)
let idx = 0;
for (const {case2} of [{case2: 0}, {case2: 1}, {case2: 2}]) {
	for (const {a2,b2,n} of generateCase2Vars(case2)) {
		for (const {case3} of [{case3: 1}, {case3: 2}]) {
			for (const {a3,b3,signCase} of generateCase3Vars(case3)) {
				idx++;
				vars200.push({
					case1: 0,
					a1: 0,
					b1: 0,
					c1: 0,
					signCase1: 0,
					case2,
					a2,
					b2,
					n,
					case3,
					a3,
					b3,
					signCase3: signCase,
					permute: getRandomInt(0,5),
					idx,
					id: generateID(0,0,0,0,0,case2,a2,b2,n,case3,a3,b3,signCase)
				})
			}
		}
	}
}

//! shuffle vars with Fisher-Yates algorithm
for (let i = vars200.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars200[i], vars200[j]] = [vars200[j], vars200[i]];
}
vars200 = vars200.slice(0, 200);

//! other cases
for (const {case1} of [{case1: 1}, {case1: 2}, {case1: 3}]) {
	for (const {a1,b1,c1,signCase1} of generateCase1Vars(case1)){
		for (const {case2} of [{case2: 0}, {case2: 1}, {case2: 2}]) {
			for (const {a2,b2,n} of generateCase2Vars(case2)) {
				for (const {case3} of [{case3: 1}, {case3: 2}]) {
					for (const {a3,b3,signCase: signCase3} of generateCase3Vars(case3)) {
						idx++;
						vars300.push({
							case1,
							a1,
							b1,
							c1,
							signCase1,
							case2,
							a2,
							b2,
							n,
							case3,
							a3,
							b3,
							signCase3,
							permute: getRandomInt(0,5),
							idx,
							id: generateID(case1,a1,b1,c1,signCase1,case2,a2,b2,n,case3,a3,b3,signCase3)
						})
					}
				}
			}
		}
	}
}
//! shuffle vars with Fisher-Yates algorithm
for (let i = vars300.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[vars300[i], vars300[j]] = [vars300[j], vars300[i]];
}
vars300 = vars300.slice(0, 300);

//! create vars
const vars500: Prisma.v_int_090101CreateInput[] = [...vars200, ...vars300];

fs.writeFileSync(`./src/lib/investigations/jsons/${table}_500.json`, JSON.stringify(vars500));
//fs.writeFileSync(`./src/lib/investigations/jsons/${table}.json`, JSON.stringify(vars200));

const main = async () => {
	//await client[table].createMany({ data: vars500 });
	//await client.v_eqns_010301.createMany({ data: vars });
};

main();

// first generating set
function generateCase2Vars(case2: number): { a2: number, b2: number, n: number }[] {
	const case2Array: { a2: number, b2: number, n: number }[] = [];
	if (case2===0){ // ln case: 5 cases
		return [
			{a2: 0, b2: 0, n: 1},
			{a2: 0, b2: 0, n: 2},
			{a2: 0, b2: 0, n: 3},
			{a2: 0, b2: 0, n: -2},
			{a2: 0, b2: 0, n: -3},
		];
	}
	if (case2===2){ // trig case: 4 cases
		// a2: 0 for sin, 1 for cos
		return [
			{a2: 0, b2: 0, n: 2},
			{a2: 1, b2: 0, n: 2},
			{a2: 0, b2: 0, n: 3},
			{a2: 1, b2: 0, n: 3},
		]
	}
	// x^a + b case: 8 cases
	// a2: 2-9, b2: pm 1-9, n: pm 2-9
	const ids: string[] = [];
	for (let i=0; i < 8; i++){ // positive n
		let [a2, b2, n] = generateABN(i);
		while (ids.includes(generateID(a2,b2,n))){
			[a2, b2, n] = generateABN(i);
		}
		case2Array.push({a2, b2, n});
		ids.push(generateID(a2,b2,n));
	}
	return case2Array;
}

function generateABN(i: number): [number, number, number]{
	// a2: 2-9, b2: pm 1-9, n: pm 2-9
	let n = getRandomInt(2,9);
	if (i >= 4){
		n = -n;
	}
	return [
		getRandomInt(2,9),
		getRandomInt(-9,9,{avoid: 0}),
		n
	]
};

function generateCase3Vars(case3: number): { a3: number, b3: number, signCase: number }[] {
	// 1: x^a + b, 2: trig
	if (case3 === 2){
		// a3: 0 for sin, 1 for cos, 2 for tan
		return [
			{a3: 0, b3: 0, signCase: 0},
			{a3: 1, b3: 0, signCase: 0},
			{a3: 2, b3: 0, signCase: 0},
		]
	}
	// x^a + b: 12 cases
	// 0-3: x^a + b, 4-7: x^a - b, 8-11: -x^a + b
	const ids: string[] = [];
	const case3Array: { a3: number, b3: number, signCase: number }[] = [];
	for (let i=0; i < 12; i++){
		let a3 = getRandomInt(2,9);
		let b3 = getRandomInt(1,9);
		const signCase = i % 3;
		while (ids.includes(generateID(a3,b3,signCase))){
			a3 = getRandomInt(2,9);
			b3 = getRandomInt(1,9);
		}
		case3Array.push({a3, b3, signCase});
		ids.push(generateID(a3,b3,signCase));
	}
	return case3Array;
}

// second generating set
function generateCase1Vars(case1: number): { a1: number, b1: number, c1: number, signCase1: number }[] {
	// 1: x^a + b, 2: ax^2 + bx + c
	const ids: string[] = [];
	const case1Array: { a1: number, b1: number, c1: number, signCase1: number }[] = [];
	if (case1 === 2){
		for (let i = 0; i < 3; i++){
			let a1 = getRandomInt(2,4);
			let b1 = getRandomInt(-9,9);
			let c1 = getRandomInt(-9,9, {avoid: 0});
			while (ids.includes(generateID(a1,b1,c1))){
				a1 = getRandomInt(2,4);
				b1 = getRandomInt(-9,9);
				c1 = getRandomInt(-9,9, {avoid: 0});
			}
			case1Array.push({a1, b1, c1, signCase1: 0});
			ids.push(generateID(a1,b1,c1));
		}
		return case1Array;
	}
	// case 1 === 1
	for (let i=0; i < 3; i++){
		let a1 = getRandomInt(2,9);
		let b1 = getRandomInt(1,9);
		const signCase1 = i % 3;
		while (ids.includes(generateID(a1,b1,signCase1))){
			a1 = getRandomInt(2,9);
			b1 = getRandomInt(1,9);
		}
		case1Array.push({a1, b1, c1: 0, signCase1});
		ids.push(generateID(a1,b1,signCase1));
	}
	return case1Array;
}