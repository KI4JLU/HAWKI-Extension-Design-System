<script lang="ts">
	let { label = 'HAWKI Extension Design System' }: { label?: string } = $props();
</script>

<!--
	No design-system component exists yet. This is a build-pipeline smoke test
	(card 06), not a component to build on — it is removed once the first real
	component lands (card 14). The <style> block below is card 08's smoke test
	for the token/dark-mode pipeline, for the same reason — it uses semantic
	aliases only, so it also doubles as check-token-usage.sh's first non-empty
	exercise.
-->
<p data-testid="placeholder">{label}</p>

<style>
	p {
		background: var(--color-surface);
		color: var(--color-text);
		border: var(--border-width-thin) var(--border-style-solid) var(--color-border);
		padding: var(--spacing-2);
	}
</style>
