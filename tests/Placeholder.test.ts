import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Placeholder from '../src/lib/Placeholder.svelte';

describe('Placeholder', () => {
	it('renders the default label', () => {
		render(Placeholder);
		expect(screen.getByTestId('placeholder').textContent).toBe('HAWKI Extension Design System');
	});

	it('renders a custom label', () => {
		render(Placeholder, { label: 'custom' });
		expect(screen.getByTestId('placeholder').textContent).toBe('custom');
	});
});

// Dark-mode rendering (card 08 DoD: "both themes render correctly for a
// scratch component") is verified in Placeholder.stories.svelte's "Theming
// smoke test" play function instead of here — it runs in a real browser via
// @storybook/addon-vitest, where getComputedStyle actually reflects the
// imported stylesheet's cascade. jsdom (this file's environment) doesn't
// implement a real CSS engine, so the same assertion here would only ever
// observe empty/default values regardless of which theme is active.
