import { Expression, Term, Fraction, cramersFrac, Polynomial, bisection } from 'mathlify';
import { display, equation, math, newParagraph, } from 'mathlifier';

export function qnGen(vars: {
	a: number;
	b: number;
	c: number;
	signCase: number;
}): [string, string, string, string] {
	// ln (ax) sign c-bx
	const { a, b, c, signCase } = vars;
	const sign = signCase === 1 ? '>' : '<';
	const ax = new Polynomial(a);
	const linear = new Polynomial([c,-b], {ascending: true});
	const x = bisection((x)=>Math.log(a*x)-c+b*x, 1/a, c/b);
	const axBracket = a===1 ? `x` : `(${ax})`;
	
	//! generate question
	const qn = `Solve the inequality
		${display(`\\ln ${axBracket} ${sign} ${linear}`)}
	`;

	//! solve question
	const ans = signCase < 0 ? `0 < x < ${x.toPrecision(3)}` : `x > ${x.toPrecision(3)}`;
	const ansGen = ans;

	//! generate solution
	const soln = `From the GC, the two graphs intersect at 
		${math(`x=${x.toPrecision(5)}.`)}
	`;
	
	return [qn, ans, ansGen, soln];
}