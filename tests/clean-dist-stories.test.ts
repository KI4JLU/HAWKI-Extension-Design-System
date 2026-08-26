import { describe, expect, it } from 'vitest';
import { isStoryOrDocsArtifact } from '../scripts/clean-dist-stories.mjs';

describe('isStoryOrDocsArtifact', () => {
	it('flags story files across every extension Storybook accepts', () => {
		expect(isStoryOrDocsArtifact('Button.stories.svelte')).toBe(true);
		expect(isStoryOrDocsArtifact('Button.stories.svelte.d.ts')).toBe(true);
		expect(isStoryOrDocsArtifact('Button.stories.ts')).toBe(true);
		expect(isStoryOrDocsArtifact('Button.stories.js')).toBe(true);
	});

	it('flags MDX docs pages', () => {
		expect(isStoryOrDocsArtifact('Tokens.mdx')).toBe(true);
	});

	it('leaves real component output alone', () => {
		expect(isStoryOrDocsArtifact('Button.svelte')).toBe(false);
		expect(isStoryOrDocsArtifact('Button.svelte.d.ts')).toBe(false);
		expect(isStoryOrDocsArtifact('index.js')).toBe(false);
		expect(isStoryOrDocsArtifact('index.d.ts')).toBe(false);
	});
});
