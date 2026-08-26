<script lang="ts">
	import { onMount } from 'svelte';

	const PREFIXES = ['--color-', '--spacing-', '--radius-', '--elevation-', '--transition-'];

	let tokens = $state<{ name: string; value: string }[]>([]);

	onMount(() => {
		const computed = getComputedStyle(document.documentElement);
		const found: { name: string; value: string }[] = [];
		for (const sheet of Array.from(document.styleSheets)) {
			let rules: CSSRuleList;
			try {
				rules = sheet.cssRules;
			} catch {
				continue;
			}
			for (const rule of Array.from(rules)) {
				if (!(rule instanceof CSSStyleRule)) continue;
				for (const prop of Array.from(rule.style)) {
					if (PREFIXES.some((prefix) => prop.startsWith(prefix))) {
						found.push({ name: prop, value: computed.getPropertyValue(prop).trim() });
					}
				}
			}
		}
		tokens = found;
	});
</script>

<div data-testid="live-token-table">
	{#if tokens.length === 0}
		<p>
			No design tokens are defined yet — the token entry points land in card 08. This table reads
			live values via <code>getComputedStyle</code> and will populate itself once they exist;
			nobody has to remember to update it by hand.
		</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Token</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{#each tokens as token (token.name)}
					<tr>
						<td><code>{token.name}</code></td>
						<td><code>{token.value}</code></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
