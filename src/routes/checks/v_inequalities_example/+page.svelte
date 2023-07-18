<script lang="ts">
	import { math, align, alignStar, gatherStar, equation, display } from 'mathlifier';
	import { Complex, Expression, Fraction, Polynomial, Term, factorizeQuadratic } from 'mathlify';
	
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let pw = '';

	import type { v_inequalities_example } from '@prisma/client';

	let {vars, count, total} = data;
	let qn: string, ans: string, ansGen: string, soln: string;
	let qnToShow = vars !== null;
	let i = 0;
	let varRow: v_inequalities_example;
	if (qnToShow && vars){
		varRow = vars[i];
		[qn, ans, ansGen, soln] = qnGen(varRow);
	}

	function qnGen(vars: v_inequalities_example): [string, string, string, string] {
		const {a,b,c,d,B,signCase} = vars;
		
		// (Cx + D) / (x-d) sign B - ax

		// C = B + ad - b - ac
		// D = bc - Bd
		const C = B + a*d - b - a*c;
		const D = b*c - B*d;
		const sign = signCase === 1 ? '>' : '<';
		const numQn = new Polynomial([C, D]);
		const den = new Polynomial([1, -d]);
		const rhs = new Polynomial([B, -a], {ascending: true});


		//// generate question
		const qn = `${display(`\\frac{${numQn}}{${den}} ${sign} ${rhs}`)}`

		//// solve question
		// move rhs over: -B + ax
		const exp1 = new Expression(`\\frac{${numQn}}{${den}}`, -B, new Term(a, 'x'));
		// combine fraction
		const negBPlusAx = new Polynomial([-B, a], {ascending: true});
		const exp2 = `\\frac{${numQn} + (${negBPlusAx})(${den})}{${den}}`;
		// expand and simplify
		const num3 = numQn.plus(negBPlusAx.times(den));
		const exp3 = `\\frac{${num3}}{${den}}`;
		// if negative, multiply by -1
		const isNegative = num3.coeffs[num3.coeffs.length-1].isLessThan(0);
		const newSign = isNegative ? toggleSign(sign) : sign;
		const exp3a = isNegative ? `\\\\ \\frac{${num3.negative()}}{${den}} &${newSign} 0` : '';
		// factorize
		const num4 = isNegative ? num3.negative() : num3;
		const [factor1, factor2, roots] = factorizeQuadratic(num4);
		const exp4 = `\\frac{${handleFactors(factor1, factor2)}}{${den}}`;

		const signGen = isNegative ? signCase*-1 : signCase;

		//// generate answer
		const ans = generateInequalitiesAnswer(new Fraction(b,a),c,d,signCase*a);
		const ansGen = generateInequalitiesAnswer(roots[0], roots[1], d, signGen);

		//// generate solution
		let soln = `${alignStar(`\\frac{${numQn}}{${den}} &${sign} ${rhs}
				\\\\ ${exp1} &${sign} 0
				\\\\ ${exp2} &${sign} 0
				\\\\ ${exp3} &${sign} 0
				${exp3a}
				\\\\ ${exp4} &${newSign} 0
			`)}
		`;
		// TODO: number line
		soln += generateInequalitiesAnswer(roots[0], roots[1], d, signCase*a);
		return [qn, ans, ansGen, soln];
	}

	async function put(outcome: string) {
		try {
			const {id} = varRow;
			const response = await fetch(`/api/v_inequalities_example/${id}`, {
				method: 'PATCH',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({pw: pw.trim(), outcome })
			})
			console.log(`${outcome}`, response);
			if (response.status===200){
				i++;
				count--;
				if (i < vars.length){
					varRow = vars[i];
					[qn, ans, ansGen, soln] = qnGen(varRow);
				} else {
					await invalidateAll();
					({vars, count, total} = data);
					i = 0;
					qnToShow = vars !== null;
					if (qnToShow && vars){
						varRow = vars[i];
						[qn, ans, ansGen, soln] = qnGen(varRow);
					}
				}
			}
		} catch(error){
			console.log(error)
		}
	}

	// solve (x-a)(x-b)(x-c) sign 0
	// where sign===1 means '>'
	function generateInequalitiesAnswer(a: number|Fraction, b: number|Fraction, c:number|Fraction, signCase: number): string {
		const roots = [a,b,c].sort((a,b)=>a.valueOf()-b.valueOf());
		return signCase===1 ?
			`${math(`${roots[0]} < x < ${roots[1]}`)} <span class="mx-4 inline-block">or</span> ${math(`x > ${roots[2]}`)}` :
			`${math(`x < ${roots[0]}`)} <span class="mx-4 inline-block">or</span> ${math(`${roots[1]} < x < ${roots[2]}`)}`;
	}

	function toggleSign(sign: string): string {
		return sign === '>' ? '<' : '>';
	}

	function factorBrackets(factor: string): string {
		return factor.length===1 ? factor : `(${factor})`;
	}
	function handleFactors(factor1: Polynomial, factor2: Polynomial) {
		const f1 = `${factor1}`;
		const f2 = `${factor2}`;
		return f2.length===1 ? `${factorBrackets(f2)}${factorBrackets(f1)}` : `${factorBrackets(f1)}${factorBrackets(f2)}`;
	}
</script>

{#if qnToShow}
	<h2>Question</h2>
	<p>
		{@html qn}
	</p>
	<h2>Answer</h2>
	<p>
		{@html ans}
	</p>
	<h2>Generated Answer</h2>
	<p>
		{@html ansGen}
	</p>
	<div class="approve">
		<button on:click={()=>{put('checked')}}>Approve</button>
		<button on:click={()=>{put('flagged')}}>Flag</button>
	</div>
	<h2>Solution</h2>
	<p>
		{@html soln}
	</p>
	{:else}
		<p>Completed</p>
	{/if}
<h2>Progress</h2>
<p>{total - count}/{total}. {((total - count)/total*100).toFixed(2)}%.</p>
<input bind:value={pw} />
<div>
	{JSON.stringify(varRow)}
</div>


<style>
	.approve {
		margin-bottom: 2em;
	}
	button {
		min-height: 4em;
		min-width: 8em;
	}
	.approve {
		display: flex;
		justify-content: space-between;
	}
	:global(.mx-4.inline-block) {
		display: inline-block;
		margin-left: 1em;
		margin-right: 1em;
	}
</style>