import { Polynomial, Expression, Term, Fraction, completeSquare, solveLinear, cramers, cramersFrac } from 'mathlify';
import { align, alignStar, display, equation, gatherStar, math, newline } from 'mathlifier';

export function qnGen(vars: {
	a: number;
	b: number;
	c: number;
	x1: number;
	x2: number;
}): [string, string, string, string] {
	const { a, b, c, x1, x2 } = vars;

	// f(x) = ax^2 + bx + c
	const f = new Polynomial([a, b, c]);
	const fx1 = f.subIn(x1);
	const fx2 = f.subIn(x2);
	const dydx = f.differentiate().subIn(x1);

	//! generate question
	const qn = `The graph of ${math(`y=f(x),`)} where
		${math(`f(x)`)} is a quadratic polynomial, passes through
		the point ${math(`(${x2}, ${fx2})`)}
		and has gradient ${math(`${dydx}`)} at the point ${math(`(${x1}, ${fx1}).`)}
		Find the equation of the graph.
	`;

	//! solve question
	// from variables
	const ans = `${math(`y=${f}`)}`;
	// by solving
	const [aAns, bAns, cAns] = cramersFrac(x1*x1, x1, 1, fx1, x2*x2, x2, 1, fx2, 2*x1, 1, 0, dydx);
	const fAns = new Polynomial([aAns, bAns, cAns]);
	const ansGen = `${math(`y=${fAns}`)}`;
	
	//! generate solution
	// eqn 1
	const lhs1 = new Expression(new Term(x1*x1, 'a'), new Term(x1, 'b'), new Term(1, 'c'));
	const lhs2 = new Expression(new Term(x2*x2, 'a'), new Term(x2, 'b'), new Term(1, 'c'));
	const lhs1w = new Expression(`(${x1})^2a`, `(${x1})b`, 'c');
	const lhs2w = new Expression(`(${x2})^2a`, `(${x2})b`, 'c');
	const lhs3 = new Expression(new Term(2*x1, 'a'), new Term(1, 'b'));
	const soln = `Let ${math(`y=ax^2 + bx + c`)}
		${newline}
		Since the curve passes through ${math(`(${x1}, ${fx1})`)} and ${math(`(${x2}, ${fx2}),`)}
		${alignStar(`${lhs1w} &= ${fx1}
			\\\\ ${lhs2w} &= ${fx2}
		`)}
		${align(`${lhs1} &= ${fx1}
			\\\\ ${lhs2} &= ${fx2}
		`)}
		${display(`\\frac{\\mathrm{d}y}{\\mathrm{d}x} = 2ax + b`)}
		Since the curve has gradient ${math(`${dydx}`)} at ${math(`(${x1}, ${fx1}),`)}
		${equation(`${lhs3} = ${dydx}`)}
		Solving ${math(`(1), (2)`)} and ${math(`(3)`)} simultaneously with a GC,
		${display(`a=${aAns}, \\; b=${bAns}, \\; c=${cAns} \\; \\blacksquare`)}
	`;
	
	return [qn, ans, ansGen, soln];
}
