// KI-574: "if it isn't in a story, it isn't supported." Fails when a
// component exported from src/lib/index.ts has no sibling *.stories.*
// file — the enforcement behind that rule, not just a slogan.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const STORY_EXTENSIONS = ['svelte', 'ts', 'js'];

/** @param {string} indexSource */
export function extractComponentExports(indexSource) {
	const exportPaths = [];
	const re = /from\s+['"](\.[^'"]+\.svelte)['"]/g;
	let match;
	while ((match = re.exec(indexSource))) {
		exportPaths.push(match[1]);
	}
	return exportPaths;
}

/**
 * @param {{ indexSource: string, indexDir: string, exists?: (path: string) => boolean }} options
 */
export function findStoryCoverageGaps({ indexSource, indexDir, exists = existsSync }) {
	const missing = [];
	for (const exportPath of extractComponentExports(indexSource)) {
		const componentPath = path.resolve(indexDir, exportPath);
		const dir = path.dirname(componentPath);
		const base = path.basename(componentPath, '.svelte');
		const hasStory = STORY_EXTENSIONS.some((ext) =>
			exists(path.join(dir, `${base}.stories.${ext}`))
		);
		if (!hasStory) missing.push(exportPath);
	}
	return missing;
}

async function main() {
	const indexPath = path.resolve('src/lib/index.ts');
	const indexSource = await readFile(indexPath, 'utf-8');
	const missing = findStoryCoverageGaps({ indexSource, indexDir: path.dirname(indexPath) });

	if (missing.length === 0) {
		console.log('✓ Every exported component has a story.');
		return;
	}

	console.error('✗ Exported component(s) with no story file (one is required per export):');
	for (const exportPath of missing) console.error(`    ${exportPath}`);
	process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	await main();
}
