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
