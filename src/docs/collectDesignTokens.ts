export interface DesignToken {
	name: string;
	value: string;
}

const DEFAULT_PREFIXES = [
	'--color-',
	'--spacing-',
	'--radius-',
	'--elevation-',
	'--transition-',
	'--font-',
	'--border-',
	'--layer-',
	'--breakpoint-'
];

// The styling contract (KI-568) wraps tokens in `@layer tokens { :root { ... } }`, so a plain
// top-level CSSStyleRule scan would never see them — @layer/@media/@supports/@container all nest
// their rules one level deeper (CSSGroupingRule), so this has to recurse.
function collectStyleRules(rules: CSSRuleList, out: CSSStyleRule[]): void {
	for (const rule of Array.from(rules)) {
		if (rule instanceof CSSStyleRule) {
			out.push(rule);
		} else if ('cssRules' in rule) {
			collectStyleRules((rule as CSSGroupingRule).cssRules, out);
		}
	}
}

/**
 * Reads custom properties matching `prefixes` out of `styleSheets`, live —
 * scoped to every stylesheet in the document, not just this package's own.
 * Storybook or a future hosted-mode consumer's CSS could declare a
 * same-prefixed custom property and be indistinguishable here from a real
 * token; still acceptable post-card-08 (real tokens exist now, in
 * src/lib/styles/tokens/*.css, but this function still has no way to scope
 * to only those without hardcoding a source list, which would itself drift).
 */
export function collectDesignTokens(
	styleSheets: ArrayLike<CSSStyleSheet>,
	readValue: (name: string) => string,
	prefixes: string[] = DEFAULT_PREFIXES
): DesignToken[] {
	const styleRules: CSSStyleRule[] = [];
	for (const sheet of Array.from(styleSheets)) {
		try {
			collectStyleRules(sheet.cssRules, styleRules);
		} catch (error) {
			if (!(error instanceof DOMException)) {
				console.warn('collectDesignTokens: unreadable stylesheet', error);
			}
		}
	}

	// A property is commonly *declared* in more than one rule (e.g. :root and
	// html.darkMode both set --color-text, so the currently active theme wins)
	// — collect distinct names first, then resolve each once via readValue,
	// which already returns whichever value the cascade currently applies.
	// Keying a rendered list by name (as the Tokens page does) would otherwise
	// crash on the duplicate.
	const names = new Set<string>();
	for (const rule of styleRules) {
		for (const prop of Array.from(rule.style)) {
			if (prefixes.some((prefix) => prop.startsWith(prefix))) {
				names.add(prop);
			}
		}
	}

	return Array.from(names)
		.sort()
		.map((name) => ({ name, value: readValue(name).trim() }));
}
