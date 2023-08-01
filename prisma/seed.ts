import { PrismaClient, Prisma } from '@prisma/client';
import { generateID } from './generateID';
import fs from 'node:fs';
import { Fraction, getRandomInt } from 'mathlify';
import { shuffle } from './shuffle';
const client = new PrismaClient();

//! change below
const table = 'v_int_090202';
const vars: Prisma.v_int_090202CreateInput[] = [];
//! change above

// k / ((x + n/2)^2 + a)
// n: pm 1-10
// a: 1,4,9,16,25,36,49,64,81
// a: 2,3,5,6, 7, 10,11,13,15
// k: 1, random between 2-9

let idx = 0;
let count = 0;
let max = 0;
for (const n of generateN()) {
	for (const a of generateA()) {
		const c = new Fraction(n*n,4).plus(a);
		if (!c.isInteger() && c.abs().num > 9){ 
			max = c.abs().num;
			count++;
		} else {
			idx++;
			vars.push({
				a,
				n,
				k: 1,
				idx,
				id: generateID(1,n,a)
			})
			idx++;
			const k = getRandomInt(-9,9,{avoid: [0,1]});
			vars.push({
				a,
				n,
				k,
				idx,
				id: generateID(k,n,a)
			})
		}
	}
}
console.log(vars.length, count, max);

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
	//await client[table].createMany({ data: vars500 });
	//await client.v_eqns_010301.createMany({ data: vars });
};

main();

// first generating set
function generateA(): number[] {
	const as: number[] = [];
	// non-perfect squares
	for (const a of [2,3,5,6,7,10,11,13,15]){
		as.push(a,-a)
	}
	// perfect squares
	const squares = [1,4,9,16,25,36,49,64,81];
	for (const a of squares){
		as.push(a,-a)
	}
	return as;
}

function generateN(): number[] {
	const ns: number[] = [];
	for (let i=1; i < 10; i++){ 
		ns.push(i,-i);
	}
	return ns
}
