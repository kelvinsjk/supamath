import { Polynomial, Fraction, SquareRoot, Term, Expression } from 'mathlify';
import { display, math, align, newParagraph } from 'mathlifier';

export function qnGen(vars: {
	a: number,
	n: number,
	k: number,
}): [string, string, string, string] {
	// k / ( x + n/2 )^2 + a
	const { a, n, k } = vars;
	const nOver2 = new Fraction(n,2);
	const linear = new Polynomial([1, nOver2]);
	const den = linear.square().plus(a);
	const qn = math(`\\int \\frac{${k}}{${den}} \\, \\mathrm{d}x`);
	const rootA = new SquareRoot(Math.abs(a));
	const twoRootA = rootA.times(2);
	const numAns = rootA.isRational() ? linear.minus(rootA.coeff) : new Expression('x', nOver2, rootA.negative());
	const denAns = rootA.isRational() ? linear.plus(rootA.coeff) : new Expression('x', nOver2, rootA);
	const kOverA = rootA.isRational() ? rootA.coeff.reciprocal().times(k) : `\\frac{${k}}{${rootA}}`;
	const kOver2 = new Fraction(k, 2);
	let kOver2AFrac: Fraction|string = twoRootA.coeff.reciprocal().times(k);
	if (kOver2AFrac.abs().isEqualTo(1)){
		kOver2AFrac = kOver2AFrac.isLessThan(0) ? `- ` : ``;
	}
	const kOver2A = rootA.isRational() ? kOver2AFrac : `\\frac{${kOver2.num}}{${new Term(kOver2.den, twoRootA)}}`;
	const arcTanArg = rootA.isEqualTo(1) ? linear : (rootA.isRational() && n%2!==0) ? `\\frac{${linear.times(2)}}{${rootA.times(2)}}` : `\\frac{${linear}}{${rootA}}`;
	const ans = a > 0 ? `${new Term(kOverA, `\\tan^{-1} \\left( ${arcTanArg} \\right) + c`)}`
		: `${kOver2A} \\ln \\left \\lvert \\frac{${numAns}}{${denAns}} \\right \\rvert + c`
	return [qn, math(ans), '', ''];
}