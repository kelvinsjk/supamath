<script lang="ts">
  import '../katex.min.css';
</script>

<main>
  <slot />
</main>

<style>
  main {
    max-width: 500px;
    margin-inline: auto;
  }
  :global(#calculator) {
		width: 375px;
		height: 375px;
		margin-inline: auto;
	}
</style>