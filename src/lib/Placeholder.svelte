<script lang="ts">
	let { label = 'HAWKI Extension Design System' }: { label?: string } = $props();
</script>

<!--
	No design-system component exists yet. This is a build-pipeline smoke test
	(card 06), not a component to build on — it is removed once the first real
	component lands (card 14).
-->
<p data-testid="placeholder">{label}</p>
