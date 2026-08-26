<script lang="ts">
	import { onMount } from 'svelte';
	import { collectDesignTokens, type DesignToken } from './collectDesignTokens';

	let tokens = $state<DesignToken[]>([]);

	onMount(() => {
		const computed = getComputedStyle(document.documentElement);
		tokens = collectDesignTokens(document.styleSheets, (name) => computed.getPropertyValue(name));
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
