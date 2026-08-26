<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Placeholder from './Placeholder.svelte';

	const { Story } = defineMeta({
		title: 'Internal/Placeholder',
		component: Placeholder,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Build-pipeline smoke test only (card 06/07) — proves the package build, Storybook, and the story-coverage check work end to end. Not a design-system component; removed once the first real component lands (card 14).'
				}
			}
		}
	});
</script>

<Story name="Default" />

<Story name="Custom label" args={{ label: 'custom label' }} />
