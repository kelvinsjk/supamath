import { Polynomial, Expression, Term, Fraction, completeSquare, solveLinear, cramers, cramersFrac } from 'mathlify';
import { align, alignStar, display, equation, gatherStar, math, newParagraph, newline } from 'mathlifier';

export function qnGen(vars: {
	a1: number;
	b1: number;
	c1: number;
	a2: number;
	b2: number;
	c2: number;
	x1: number;
	x2: number;
	x3: number;
}): [string, string, string, string] {
	const { a1, b1, c1, a2, b2, c2, x1, x2, x3 } = vars;
	const total = (x1+x2+x3)*100;
	const costPrice = (a1*x1 + b1*x2 + c1*x3)*100;
	const sellingPrice = (a2*x1 + b2*x2 + c2*x3)*100;
	const profit = sellingPrice - costPrice;
	const profitString = profit > 0 ? 'profit' : 'loss';

	//! generate question
	const qn = `Mr. Tan invests in the stock market in January one year, buying
		a total of ${math(`${total}`)} units of shares across three companies,
		${math(`A, B`)} and ${math(`C.`)}
		${newParagraph}
		In January, the share prices of companies ${math(`A, B`)} and ${math(`C`)} are
		${math(`${varToDollar(a1)}, ${varToDollar(b1)}`)}
		and ${math(`${varToDollar(c1)}`)} per unit of share respectively.
		He paid a total of ${math(`\\$${costPrice/2}`)} for the shares.
		${newParagraph}
		In December, the share prices of companies ${math(`A, B`)} and ${math(`C`)} are
		${math(`${varToDollar(a2)}, ${varToDollar(b2)}`)}
		and ${math(`${varToDollar(c2)}`)} per unit of share respectively. He sold all his shares
		in December for a total ${profitString} of
		${math(`\\$${Math.abs(profit)/2}.`)}
		${newParagraph}
		Determine how many units of shares Mr. Tan bought for each company.
	`;

	//! solve question
	// from variables
	const ans = math(`a=${x1*100}, b=${x2*100}, c=${x3*100}.`);
	// by solving
	const [aAns, bAns, cAns] = cramersFrac(
		1, 1, 1, total,
		new Fraction(a1,2), new Fraction(b1,2), new Fraction(c1,2), new Fraction(costPrice,2),
		new Fraction(a2,2), new Fraction(b2,2), new Fraction(c2,2), new Fraction(costPrice+profit,2),
	);
	const ansGen = math(`a=${aAns}, b=${bAns}, c=${cAns}.`);

	//! generate solution
	const lhs2 = new Expression(`${(a1/2).toFixed(2)}a`, `${(b1/2).toFixed(2)}b`, `${(c1/2).toFixed(2)}c`);
	const lhs3 = new Expression(`${(a2/2).toFixed(2)}a`, `${(b2/2).toFixed(2)}b`, `${(c2/2).toFixed(2)}c`);
	const profitWorking = new Expression(costPrice/2, new Term(profit/2, ' '));
	const soln = `Let ${math(`a,b`)} and ${math(`c`)} be the number of units of shares Mr. Tan
		bought for companies ${math(`A, B`)} and ${math(`C`)} respectively.
		${equation(`a+b+c = ${total}`)}
		In January,
		${equation(`${lhs2} = ${costPrice/2}`)}
		Since he made a ${profitString} of ${math(`\\$${Math.abs(profit)/2},`)} the stocks sold for
		${display(`${profitWorking} = ${(costPrice+profit)/2}`)}
		${equation(`${lhs3} = ${(costPrice+profit)/2}`)}
		Solving ${math(`(1), (2)`)} and ${math(`(3)`)} simultaneously with a GC, we get
		${display(`a=${aAns}, \\; b=${bAns}, \\; c=${cAns} \\; \\blacksquare`)}
	`;
	
	return [qn, ans, ansGen, soln];
}

function varToDollar(x: number): string {
	const d = Math.floor(x/2);
	const c = x%2 === 0 ? '00' : '50';
	return `\\$${d}.${c}`;
}