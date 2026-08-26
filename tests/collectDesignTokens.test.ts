import { describe, expect, it } from 'vitest';
import { collectDesignTokens } from '../src/docs/collectDesignTokens';

function styleSheetFrom(css: string): CSSStyleSheet {
	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);
	return style.sheet!;
}

describe('collectDesignTokens', () => {
	it('finds a token declared in a plain top-level rule', () => {
		const sheet = styleSheetFrom(':root { --color-accent-500: red; }');

		const tokens = collectDesignTokens([sheet], () => 'red');

		expect(tokens).toEqual([{ name: '--color-accent-500', value: 'red' }]);
	});

	it('finds a token nested inside @layer (the real KI-568 shape) — regression for the bug where only top-level CSSStyleRule was scanned', () => {
		const sheet = styleSheetFrom('@layer tokens { :root { --color-accent-500: red; } }');

		const tokens = collectDesignTokens([sheet], () => 'red');

		expect(tokens).toEqual([{ name: '--color-accent-500', value: 'red' }]);
	});

	it('finds a token nested two levels deep (@layer inside @media)', () => {
		const sheet = styleSheetFrom(
			'@media (min-width: 1px) { @layer tokens { :root { --spacing-md: 1rem; } } }'
		);

		const tokens = collectDesignTokens([sheet], () => '1rem');

		expect(tokens).toEqual([{ name: '--spacing-md', value: '1rem' }]);
	});

	it('ignores properties that do not match a known prefix', () => {
		const sheet = styleSheetFrom(':root { --unrelated-thing: 1; }');

		const tokens = collectDesignTokens([sheet], () => '1');

		expect(tokens).toEqual([]);
	});

	it('returns nothing for an empty stylesheet list, as it does before card 08 lands', () => {
		expect(collectDesignTokens([], () => '')).toEqual([]);
	});
});
