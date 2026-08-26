<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LiveTokenTable from './LiveTokenTable.svelte';

	const { Story } = defineMeta({
		title: 'Governance/Tokens',
		component: LiveTokenTable
	});
</script>

<Story name="Live" />
