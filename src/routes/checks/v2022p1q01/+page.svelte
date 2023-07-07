<script lang="ts">
	import { math, align, alignStar, gatherStar, equation } from 'mathlifier';
	import { Complex, Expression, Term } from 'mathlify';
	
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let pw = '';

	type Variables = {a: number, b: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, b2: number, id: string};

	let {vars, count, total} = data;
	let qn: string, ans: string, ansGen: string, soln: string;
	let qnToShow = vars !== null;
	let i = 0;
	let varRow: Variables;
	if (qnToShow && vars){
		varRow = vars[i];
		[qn, ans, ansGen, soln] = qnGen(varRow);
	}

	function qnGen(vars: Variables): [string, string, string, string] {
		const {a,b,x1,y1,x2,y2,x3,y3,b2} = vars;
		
		// a i z   + bw     = c1
		// alpha z + b2 i w = c2

		//// set up a_s, b_s
		// a1 z + b1 w = c1
		const a1 = new Complex(0, a);
		const b1 = new Complex(b);
		//const c1 = new Complex(-1);
		const a2 = new Complex(x3, y3);
		const b2i = new Complex(0, b2);
		//const c2 = new Complex(6);

		//// answers
		const z = new Complex(x1, y1);
		const w = new Complex(x2, y2);

		//// generate c1, c2
		const c1 = a1.times(z).plus(b1.times(w));
		const c2 = a2.times(z).plus(b2i.times(w));

		//// generate question
		function sign(x: number): string {
			return x < 0 ? '' : '+';
		}
		const lhs1 = new Expression(new Term(a, '\\mathrm{i} z'), new Term(b, 'w'));
		const lhs2 = new Expression(`(${a2}) z`, new Term(b2, '\\mathrm{i} w'));
		const qn = `${alignStar(`${lhs1} &= ${c1}
			\\\\ ${lhs2} &= ${c2}
		`)}`

		//// solve question
		// make w subject
		// w = (c1 - a1 z)/b1
		// w = d1 + e1 z
		const d1 = c1.divide(b1);
		const e1 = a1.negative().divide(b1);
		// sub in
		const zCoeff = a2.plus(e1.times(b2i));
		const rhs = c2.minus(d1.times(b2i));
		const zAns = rhs.divide(zCoeff);
		const wAns = d1.plus(e1.times(z));

		//const body = `${math(`z=${zAns},`)} ${math(`w=${wAns}.`)}`;
		const ans = `${math(`z=${zAns},`)} ${math(`w=${wAns}.`)}`;
		const ansGen = `${math(`z=${z},`)} ${math(`w=${w}.`)}`

		// solution
		const wNum = new Expression(c1.real, new Term(-a, '\\mathrm{i} z'))
		const wExp = `\\frac{${wNum}}{${b1}}`;
		const lhs = a2.times(2).plus(1);
		//const i = `\\mathrm{i}`;

		// working params
		const num = rhs.times(2);
		const den = lhs;
		const expanded = new Expression(num.real.times(den.real), new Term(num.real.times(den.imag.negative()), 'i'), new Term(num.imag.times(den.real), '\\mathrm{i} '), new Term(num.imag.times(den.imag.negative()), '\\mathrm{i}^2'));
		const expanded2 = new Expression(c1.real, new Term(a, -1, 'i', zAns.real), new Term(a, -1, zAns.imag, '\\mathrm{i}^2'));


		let soln = `${align(`${lhs1} &= ${c1}
				\\\\ ${lhs2} &= ${c2}
			`)}
			From ${math(`(1),`)}
		`;
		soln += `${equation(`w = \\frac{${wNum}}{${b1}}`)}
			Substituting ${math(`(3)`)} into ${math(`(2),`)}
			${gatherStar(`(${a2})z ${sign(b2)} ${b2i} \\left( ${wExp} \\right) = ${c2} \\\\
				(${a2.times(2)})z ${sign(b2)} ${b2i} ( -1 - \\mathrm{i} z )   = 12 \\\\
				(${a2.times(2)})z ${sign(-b2)} ${b2i.negative()}  + z                     = 12 \\\\
				(${a2.times(2).plus(1)})z                          = ${rhs.times(2)}
			`)}
			${alignStar(` z &= \\frac{${num}}{${den}} \\times \\frac{${den.conjugate()}}{${den.conjugate()}} \\\\
				&= \\frac{${expanded}}{${den.real.abs()}^2 + ${den.imag.abs()}^2} \\\\
				&= ${zAns} \\; \\blacksquare
			`)}
			${/* w = (c1 - a1 z)/b1 */''}
			${alignStar(`w &= \\frac{${c1} ${sign(-a)} ${a1.negative()}(${z})}{${b1}} \\\\
				&= \\frac{${expanded2}}{2} \\\\
				&= ${w} \\; \\blacksquare
			`)}
		`;
		return [qn, ans, ansGen, soln];
	}

	async function patch(outcome: string) {
		try {
			const {id} = varRow;
			const response = await fetch(`/api/v2022p1q01/${id}`, {
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
		<button on:click={()=>{patch('checked')}}>Approve</button>
		<button on:click={()=>{patch('flagged')}}>Flag</button>
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
</style>