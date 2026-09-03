<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
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

<Story
	name="Theming smoke test"
	play={async ({ canvasElement }) => {
		// Card 08 DoD: "both themes render correctly for a scratch component."
		// Runs in a real browser (addon-vitest/Playwright), unlike a jsdom unit
		// test — jsdom doesn't implement a real CSS engine, so getComputedStyle
		// there never reflects an external stylesheet's cascade.
		const canvas = within(canvasElement);
		const el = canvas.getByTestId('placeholder');

		document.documentElement.classList.remove('darkMode');
		const light = getComputedStyle(el).backgroundColor;

		document.documentElement.classList.add('darkMode');
		const dark = getComputedStyle(el).backgroundColor;
		document.documentElement.classList.remove('darkMode');

		await expect(light).not.toBe('');
		await expect(dark).not.toBe('');
		await expect(dark).not.toBe(light);
	}}
/>
