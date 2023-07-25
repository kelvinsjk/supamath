import { Polynomial, solveLinear, Expression, Term, Fraction } from 'mathlify';
import { display, math, align, newParagraph } from 'mathlifier';

export function qnGen(vars: {
	case1: number;
	a1: number;
	b1: number;
	c1: number;
	signCase1: number;
	case2: number; 	
	a2: number;
	b2: number;
	n: number;
	case3: number;
	a3: number; 
	b3: number; 
	signCase3: number,
	permute: number,
}): [string, string, string, string] {
	// case 1: f'(x) / f(x)
	// 0: ln x, 1: x^a + b, 2: ax^2 + bx + c
	// case 2: f'(x) ( f(x) )^n
	// 0: ln x, 1: x^a + b, 2: trig
	// case 3: f'(x) exp( f(x) )
	// 1: x^a + b, 2: trig
	const { case1, a1, b1, c1, signCase1, case2, a2, b2, n, case3, a3, b3, signCase3, permute } = vars;
	const [qn1, ans1] = case1Gen(case1, a1, b1, c1, signCase1);
	const [qn2, ans2] = case2Gen(case2, a2, b2, n);
	const [qn3, ans3] = case3Gen(case3, a3, b3, signCase3);

	const qn = `${qn1}${newParagraph}${qn2}${newParagraph}${qn3}`;
	const ans = `${ans1}${newParagraph}${ans2}${newParagraph}${ans3}`;
	return [qn, ans, '', ''];
}

function case1Gen(case1: number,
	a1: number,
	b1: number,
	c1: number,
	signCase1: number,): [string, string, string, string] {
	// case 1: f'(x) / f(x)
	// 0: ln x, 1: x^a + b, 2: ax^2 + bx + c
	if (case1===0){
		const ans = math(`\\ln \\lvert \\ln x \\rvert + c`);
		return [math(`\\int \\frac{1}{x \\ln x} \\; \\mathrm{d}x`), ans, ans, '']
	}
	if (case1===1){
		const xA = `x^{${a1}}`;
		const fx = signCase1===0 ? new Expression(xA, b1)
			: signCase1===1 ? new Expression(xA, -b1)
			: new Expression(b1, new Term(-1, xA));
		const fPrime = a1===2 ? `x` : `x^{${a1-1}}`;
		const qn = math(`\\int \\frac{${fPrime}}{${fx}} \\; \\mathrm{d}x`);
		const ans = math(`\\frac{1}{${a1}} \\ln ${modulus(`${fx}`, a1, signCase1)} + c`);
		return [qn, ans, ans, ''];
	}
	// case 2: ax^2 + bx + c
	const fx = new Polynomial([a1,b1,c1]);
	const fPrime = fx.differentiate()
	const fPrimeSimplified = fPrime.simplify();
	const multiple = fPrimeSimplified.coeffs[0].divide(fPrime.coeffs[0]);
	const qn = math(`\\int \\frac{${fPrimeSimplified}}{${fx}} \\; \\mathrm{d}x`);
	const alwaysPositive = new Fraction(b1).square().minus(new Fraction(4).times(a1).times(c1)).isLessThan(0) ? 1 : 0;
	const lnTerm = new Term(multiple, `\\ln ${modulus(`${fx}`,2,alwaysPositive)}`);
	const ans = math(`${lnTerm} + c`);
	return [qn, ans, ans, ''];
}

function modulus(x: string, a: number, signCase: number): string {
	return (signCase===1 && a%2===0) ? `\\left( ${x} \\right)` : `\\lvert ${x} \\rvert`; 
}

function case2Gen(case2: number, a2: number, b2: number, n: number): [string, string, string, string] {
	// case 2: f'(x) ( f(x) )^n
	// 0: ln x, 1: x^a + b, 2: trig
	if (case2===0){
		const qn = n===1 ? math(`\\int \\frac{\\ln x}{x} \\; \\mathrm{d}x`)
			: n>1 ? math(`\\int \\frac{(\\ln x)^{${n}}}{x} \\; \\mathrm{d}x`)
			: math(`\\int \\frac{1}{x (\\ln x)^{${-n}}} \\; \\mathrm{d}x`);
		const ans = n>0 ? math(`\\frac{(\\ln x)^{${n+1}}}{${n+1}} + c`)
			: n === -2 ? math(`-\\frac{1}{\\ln x} + c`)
			: math(`-\\frac{1}{${-n-1}(\\ln x)^{${-n-1}}} + c`);
		return [qn, ans, ans, ''];
	}
	if (case2===1){
		// (x^a + b)^n
		const xA = `x^{${a2}}`;
		const fx = new Expression(xA, b2);
		const fPrime = a2===2 ? `x` : `x^{${a2-1}}`;
		const qn = n > 0 ? math(`\\int ${fPrime} (${fx})^{${n}} \\; \\mathrm{d}x`)
			: math(`\\int \\frac{${fPrime}}{(${fx})^{${-n}}} \\; \\mathrm{d}x`);
		let den = a2*(n+1);
		let multiple = 1;
		if (den < 0){
			multiple = -1;
			den = -den;
		}
		const ansTerm = n > 0 ? new Term(multiple, `\\frac{(${fx})^{${n+1}}}{${den}}`)
			: n===-2 ? new Term(multiple, `\\frac{1}{${fx}}`)
			: new Term(multiple, `\\frac{1}{${den}(${fx})^{${-n-1}}}`);
		const ans = math(`${ansTerm} + c`);
		return [qn, ans, ans, ''];
	}
	// case 2: trig
	const fx = a2===0 ? `\\sin` : `\\cos`;
	const fPrime = a2===0 ? `\\cos x` : `\\sin x`;
	const qn = math(`\\int ${fPrime} ${fx}^{${n}} x \\; \\mathrm{d}x`);
	const multiple = a2===0 ? 1 : -1;
	const ansTerm = new Term(multiple, `\\frac{${fx}^{${n+1}} x}{${n+1}}`);
	const ans = math(`${ansTerm} + c`);
	return [qn, ans, ans, ''];
}

function case3Gen(case3: number, a3: number, b3: number, signCase3: number): [string, string, string, string] {
	// case 3: f'(x) exp( f(x) )
	// 1: x^a + b, 2: trig
	if (case3===1){
		const xA = `x^{${a3}}`;
		const fx = signCase3===0 ? new Expression(xA, b3)
			: signCase3===1 ? new Expression(xA, -b3)
			: new Expression(b3, new Term(-1, xA));
		const fPrime = a3===2 ? `x` : `x^{${a3-1}}`;
		const qn = math(`\\int ${fPrime} \\; e^{${fx}} \\; \\mathrm{d}x`);
		const multiple = signCase3===2 ? -1 : 1;
		const ansTerm = new Term(multiple, `\\frac{e^{${fx}}}{${a3}}`);
		const ans = math(`${ansTerm} + c`);
		return [qn, ans, ans, ''];
	}
	// case 3: trig
	let fx: string, fPrime: string;
	let multiple = 1;
	if (a3===0){
		fx = `\\sin x`;
		fPrime = `\\cos x`;
	} else if (a3===1){
		fx = `\\cos x`;
		fPrime = `\\sin x`;
		multiple = -1;
	} else {
		fx = `\\tan x`;
		fPrime = `\\sec^2 x`;
	}
	const qn = math(`\\int ${fPrime} \\; e^{${fx}} \\; \\mathrm{d}x`);
	const ansTerm = new Term(multiple, `e^{${fx}}`);
	const ans = math(`${ansTerm} + c`);
	return [qn, ans, ans, ''];
}