export interface DesignToken {
	name: string;
	value: string;
}

const DEFAULT_PREFIXES = ['--color-', '--spacing-', '--radius-', '--elevation-', '--transition-'];

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
 * token; acceptable today (nothing else exists yet), revisit once card 08
 * gives this something concrete to scope against.
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

	const found: DesignToken[] = [];
	for (const rule of styleRules) {
		for (const prop of Array.from(rule.style)) {
			if (prefixes.some((prefix) => prop.startsWith(prefix))) {
				found.push({ name: prop, value: readValue(prop).trim() });
			}
		}
	}
	return found;
}
