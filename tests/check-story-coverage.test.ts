import { describe, expect, it } from 'vitest';
import { findStoryCoverageGaps } from '../scripts/check-story-coverage.mjs';

describe('story coverage check', () => {
	it('passes when every exported component has a sibling story', () => {
		const indexSource = `export { default as Button } from './Button.svelte';`;
		const existing = new Set(['/lib/Button.stories.svelte']);

		const missing = findStoryCoverageGaps({
			indexSource,
			indexDir: '/lib',
			exists: (candidate) => existing.has(candidate)
		});

		expect(missing).toEqual([]);
	});

	it('demonstrates a failure: a component added without a story is flagged', () => {
		const indexSource = `
			export { default as Button } from './Button.svelte';
			export { default as Modal } from './Modal.svelte';
		`;
		// Modal.svelte exists but nobody wrote Modal.stories.svelte for it yet.
		const existing = new Set(['/lib/Button.stories.svelte']);

		const missing = findStoryCoverageGaps({
			indexSource,
			indexDir: '/lib',
			exists: (candidate) => existing.has(candidate)
		});

		expect(missing).toEqual(['./Modal.svelte']);
	});

	it('accepts a .stories.ts or .stories.js sibling, not only .svelte', () => {
		const indexSource = `export { default as Button } from './Button.svelte';`;

		const missingTs = findStoryCoverageGaps({
			indexSource,
			indexDir: '/lib',
			exists: (candidate) => candidate === '/lib/Button.stories.ts'
		});
		const missingJs = findStoryCoverageGaps({
			indexSource,
			indexDir: '/lib',
			exists: (candidate) => candidate === '/lib/Button.stories.js'
		});

		expect(missingTs).toEqual([]);
		expect(missingJs).toEqual([]);
	});
});
