<script lang="ts">
	import { math, align, alignStar, gatherStar, equation, display } from 'mathlifier';
	import { Complex, Expression, Fraction, Polynomial, Term, factorizeQuadratic } from 'mathlify';
	
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let pw = '';

	import type { v_inequalities_010102 } from '@prisma/client';
	import { qnGen } from '$lib/qns/q010102';

	let {vars, count, total} = data;
	let qn: string, ans: string, ansGen: string, soln: string;
	let qnToShow = vars !== null;
	let i = 0;
	let varRow: v_inequalities_010102;
	if (qnToShow && vars){
		varRow = vars[i];
		[qn, ans, ansGen, soln] = qnGen(varRow);
	}
	
	async function put(outcome: string) {
		try {
			const {id} = varRow;
			console.log(id);
			const response = await fetch(`/api/v_inequalities_010102/${id}`, {
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
<div class="json">
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
	.json {
		overflow-x: scroll;
		max-width: 350px;
	}
</style>