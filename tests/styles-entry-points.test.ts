import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const BARE_STATEMENT = '@layer reset, tokens, base, components, utilities;';

describe('styles entry-point contract (KI-568)', () => {
	it('full.css (standalone) declares the cascade-layer order verbatim', async () => {
		const css = await readFile(path.resolve('src/lib/styles/full.css'), 'utf-8');
		expect(css).toContain(BARE_STATEMENT);
	});

	it('tokens.css (hosted) never declares the cascade-layer order', async () => {
		const css = await readFile(path.resolve('src/lib/styles/tokens.css'), 'utf-8');
		expect(css).not.toContain(BARE_STATEMENT);
		expect(css).not.toMatch(/@layer\s+reset\s*,/);
	});
});
