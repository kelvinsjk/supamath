import { Polynomial, Expression, Term, solveQuadratic, type Fraction, solveQuadraticSurd, factorizeQuadratic } from 'mathlify';
import { display, math, gatherStar, newline, alignStar, newParagraph } from 'mathlifier';

export function qnGen(vars: {
	b: number;
	c: number;
	d: number;
	e: number;
	canTake: boolean;
	algebraic: boolean;
}): [string, string, string, string] {
	// (dx + e) / (x^2 + bx + c)
	const { b, c, d, e, canTake, algebraic } = vars;
	
	//! generate question
	const num = d > 0 ? new Polynomial([d,e]) : new Polynomial([e,d], {ascending: true});
	const den = new Polynomial([1,b,c]);
	const hint = algebraic ? `Using an algebraic method,` : `Without using a calculator,`
	const canTakeString = canTake ? `can` : `cannot`;
	const qn = `It is given that
		${display(`y = \\frac{${num}}{${den}}.`)}
		${hint} find the range of values that ${math(`y`)}
		${canTakeString} take.
	`;

	//! solve question
	// brute force linear search
	let max = -15, min = 15;
	for (let i = -15; i < 15; i += 0.01){
		const y = (d*i + e) / (i*i + b*i + c);
		if (y > max) {
			max = y;
		}
		if (y < min) {
			min = y;
		}
	}
	const ans = canTake ? math(`${min.toFixed(2)} \\leq y \\leq ${max.toFixed(2)}`)
		: math(`y < ${min.toFixed(2)}`) + ' or ' + math(`y > ${max.toFixed(2)}`);

	//! generate solution
	// cross multiply
	// x^2 y + byx + cy = dx + e
	// y x^2 + (by-d)x + cy-e = 0
	const byMinusD = new Polynomial([b,-d], {variable:'y'});
	const cyMinusE = new Polynomial([c,-e], {variable:'y'});
	const lhs1 = new Expression('yx^2', new Term(b, 'yx'), new Term(c, 'y'));
	const lhs2 = new Expression('yx^2', new Term(`(${byMinusD})x`), new Term(`(${cyMinusE})`));
	// can take: discriminant >= 0
	const sign = canTake ? `\\geq` : `<`;
	// discriminant simplification
	// our choice of variables (b^2 < 4c) ensure the first polynomial in y will have negative leading coefficients
	const lhs3 = new Expression(`(${byMinusD})^2 - 4y (${cyMinusE})`);
	const yPolyNeg = byMinusD.square().minus(cyMinusE.times(new Polynomial(4)));
	const yPoly = yPolyNeg.negative().simplify();
	const signOpp = canTake ? `\\leq` : `>`;

	//! first part of soln
	let soln = `${gatherStar(` y = \\frac{${num}}{${den}}
			\\\\ ${lhs1} = ${num}
			\\\\ ${lhs2} = 0
		`)}
		For the range of values that ${math(`y`)} ${canTakeString} take,
		the discriminant
		${display(`b^2 - 4ac ${sign} 0`)}
	`;

	//! solve for roots: extra working if surds detected
	const yRoots = solveQuadratic(yPoly);
	let y1: Fraction|Expression, y2: Fraction|Expression;
	if (yRoots[2]==='frac'){
		const [factor1, factor2] = factorizeQuadratic(yPoly);
		[y1,y2] = [yRoots[0], yRoots[1]];
		soln += `${gatherStar(` ${lhs3} ${sign} 0
				\\\\ ${yPolyNeg} ${sign} 0
				\\\\ ${yPoly} ${signOpp} 0
				\\\\ (${factor1})(${factor2}) ${signOpp} 0
			`)
		}`		
	} else {
		soln += `${gatherStar(` ${lhs3} ${sign} 0
				\\\\ ${yPolyNeg} ${sign} 0
				\\\\ ${yPoly} ${signOpp} 0
			`)}
		`;
		[y1,y2] = solveQuadraticSurd(yPoly);
		if (yPoly.coeffs[1].isEqualTo(0)){
			soln += `The roots to the equation ${math(`${yPoly} = 0`)}
				are ${math(`\\pm ${y2}`)}
				${newParagraph}
			`;
		} else {
			const [C,B,A] = yPoly.coeffs;
			const BBracket = B.isGreaterThan(0) ? `${B}` : `(${B})`;
			soln += `The roots to the equation ${math(`${yPoly} = 0`)}
				are ${alignStar(`y &= \\frac{-${BBracket} \\pm \\sqrt{ ${B}^2 - 4(${A})(${C}) }}{2(${A})}
					\\\\ &= ${y1} \\; \\textrm{ or }\\;  ${y2}
				`)}
				${newParagraph}
			`;
		}
	}
	// numerical roots for ansGen check
	const y1Num = yRoots[0].valueOf(), y2Num = yRoots[1].valueOf();
	// final solution
	const final = canTake ? `${y1} \\leq y \\leq ${y2}` : `y < ${y1} \\; \\textrm{ or } \\; y > ${y2}`

	//! soln typesetting
	soln += `Hence the range of values that ${math(`y`)} can take is
		${display(`${final} \\; \\blacksquare`)}
	`;
	

	let ansGen = canTake ? math(`${y1Num.toFixed(2)} \\leq y \\leq ${y2Num.toFixed(2)}`)
	: math(`y < ${y1Num.toFixed(2)}`) + ' or ' + math(`y > ${y2Num.toFixed(2)}`)
	ansGen += newline + math(final);
	return [qn, ans, ansGen, soln];
}