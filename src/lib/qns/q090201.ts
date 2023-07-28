import { Polynomial, Fraction, SquareRoot, Term, Expression } from 'mathlify';
import { display, math, align, newParagraph } from 'mathlifier';

export function qnGen(vars: {
	a1: number,
	b1: number,
	swap1: boolean,
	a2: number,
	b2: number,
	a3: number,
	b3: number,
	a4: number,
	b4: number,
	permute: number,
}): [string, string, string, string] {
	// a is after squaring, b is before squaring
	const { a1,	b1, swap1, a2, b2, a3, b3, a4, b4, permute, } = vars;
	// permutation index for 4 items
	const permutes = [[0,1,2,3], [0,1,3,2], [0,2,1,3], [0,2,3,1], [0,3,1,2], [0,3,2,1],
		[1,0,2,3], [1,0,3,2], [1,2,0,3], [1,2,3,0], [1,3,0,2], [1,3,2,0],
		[2,0,1,3], [2,0,3,1], [2,1,0,3], [2,1,3,0], [2,3,0,1], [2,3,1,0],
		[3,0,1,2], [3,0,2,1], [3,1,0,2], [3,1,2,0], [3,2,0,1], [3,2,1,0]
	];
	//const parts: Part[] = [];
	//const ansParts: Part[] = [];
	//const solnParts: Part[] = [];
	const a1Term = swap1 ? new Polynomial([a1,0,b1*b1],{ascending: true}) : new Polynomial([b1*b1,0,a1]);
	const a2Term = new Polynomial([a2,0,-b2*b2],{ascending: true});
	const a4Term = new Polynomial([a4,0,-b4*b4],{ascending: true});
	const a3Term = new Polynomial([b3*b3,0,-a3]);
	const parts = [a1Term, a2Term, a3Term, a4Term];
	const as = [a1, a2, a3, a4];
	const bs = [b1, b2, b3, b4];
	const answers: string[] = [];
	for (let i = 0; i < 4; i++){
		const actualA2 = new Fraction(as[i],Math.pow(bs[i],2));
		const actualA = new SquareRoot(actualA2);
		if (i===0){ // arc tan
			const rootA = new SquareRoot(as[i]);
			const xTerm = new Term(rootA.reciprocal().times(bs[i]), `x`);
			const ansTerm = new Term(actualA.reciprocal().divide(bs[i]*bs[i]), `\\tan^{-1} \\left( ${xTerm} \\right)`)
			answers.push(math(`${ansTerm} + c`))
		} else if (i===1){ // arc sin
			const rootA = new SquareRoot(as[i]);
			const xTerm = new Term(rootA.reciprocal().times(bs[i]), `x`);
			const ansTerm = new Term(new Fraction(1,bs[i]), `\\sin^{-1} \\left( ${xTerm} \\right)`)
			answers.push(math(`${ansTerm} + c`))
		} else { // ln
			const aRoot = new SquareRoot(as[i]);
			const numPoly = i===2 ? new Expression(new Term(bs[i], 'x'), aRoot.negative()) : new Expression(aRoot, new Term(bs[i], 'x'));
			const denPoly = i===2 ? new Expression(new Term(bs[i], 'x'), aRoot) : new Expression(aRoot, new Term(-bs[i], 'x'));
			const ansTerm = new Term(actualA.reciprocal().divide(bs[i]*bs[i]).divide(2), `\\ln \\left \\lvert \\frac{${numPoly}}{${denPoly}} \\right \\rvert`)
			answers.push(math(`${ansTerm} + c`))
		}
	}
	let qn = ``;
	let ans = ``;
	for (let i = 0; i < 4; i++){
		const question = parts[permutes[permute][i]];
		const answer = answers[permutes[permute][i]];
		qn += permutes[permute][i]===1 ? `${newParagraph}${math(`\\int \\frac{1}{\\sqrt{${question}}} \\, \\mathrm{d}x`)}` 
			: `${newParagraph}${math(`\\int \\frac{1}{${question}} \\, \\mathrm{d}x`)}`;
		ans += `${newParagraph}${answer}`;
	}
	//for (let i = 0; i < 3; i++){
	//	parts.push({body: qns[permutes[permute][i]]});
	//	ansParts.push({body: answers[permutes[permute][i]]});
	//	solnParts.push({body: solns[permutes[permute][i]]});
	//}
	//const qn = {body: `Integrate the following`,parts};
	//const ans = {parts: ansParts};
	//const soln = {parts: solnParts};
	return [qn, ans, '', ''];
}