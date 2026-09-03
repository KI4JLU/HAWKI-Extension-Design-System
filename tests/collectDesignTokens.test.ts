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

	it('deduplicates a property declared in more than one rule (e.g. :root and a dark override) — regression for a keyed-each crash', () => {
		const sheet = styleSheetFrom(
			'@layer tokens { :root { --color-text: black; } } @layer tokens { html.darkMode { --color-text: white; } }'
		);

		const tokens = collectDesignTokens([sheet], () => 'white');

		expect(tokens).toEqual([{ name: '--color-text', value: 'white' }]);
	});

	it('returns tokens sorted by name for stable rendering order', () => {
		const sheet = styleSheetFrom(':root { --spacing-2: 1; --color-text: 1; --radius-sm: 1; }');

		const tokens = collectDesignTokens([sheet], () => '1');

		expect(tokens.map((t) => t.name)).toEqual(['--color-text', '--radius-sm', '--spacing-2']);
	});
});
