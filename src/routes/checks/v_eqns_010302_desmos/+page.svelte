<script lang="ts">	
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let pw = '';

	//! CHANGE BELOW
	import type { v_eqns_010302 as vType } from '@prisma/client';
	const q = 'v_eqns_010302';
	import { qnGen } from '$lib/qns/q010302';
	//! CHANGE ABOVE

	let calculator: any;
	let calcContainer: HTMLDivElement;
	import { browser } from '$app/environment';

	let {vars, count, total} = data;
	let qn: string, ans: string, ansGen: string, soln: string;
	let eqn1: string, eqn2: string;
	let qnToShow = vars !== null;
	let i = 0;
	let varRow: vType;
	if (qnToShow && vars){
		varRow = vars[i];
		[qn, ans, ansGen, soln, [eqn1, eqn2]] = qnGen(varRow);
	}
	
	async function put(outcome: string) {
		try {
			const {id} = varRow;
			console.log(id);
			//CHANGE HERE 
			const response = await fetch(`/api/${q}/${id}`, {
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
					[qn, ans, ansGen, soln, [eqn1, eqn2]] = qnGen(varRow);
				} else {
					await invalidateAll();
					({vars, count, total} = data);
					i = 0;
					qnToShow = vars !== null;
					if (qnToShow && vars){
						varRow = vars[i];
						[qn, ans, ansGen, soln, [eqn1, eqn2]] = qnGen(varRow);
					}
				}
				updateCalc();
			}
		} catch(error){
			console.log(error)
		}
	}

	function initCalc(): void {
		if (browser){
			// @ts-ignore
			calculator = Desmos.GraphingCalculator(calcContainer, {keypad: false, expressions: false, settingsMenu: false, zoomButtons: false});
			updateCalc();
		}
	}

	function updateCalc(): void {
		calculator.setExpression({id:'graph1', latex: `y= \\left| ${eqn1} \\right|`});
		calculator.setExpression({id:'graph2', latex: `${eqn2}`});
		calculator.setMathBounds({
			left: -10,
			right: 10,
			bottom: -1,
			top: 10
		});
	}
</script>

{#if browser}
	<script src="https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6" on:load={initCalc}></script>
{/if}

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
	<div id="calculator" bind:this={calcContainer}></div>
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