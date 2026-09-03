// svelte-package ships everything under src/lib verbatim — it has no
// built-in exclusion for *.stories.* / *.mdx (removed along with
// config.package, see https://github.com/sveltejs/kit/pull/8922). Stories
// stay colocated with their component (the Storybook convention this
// library follows), so the cleanup happens here instead, after packaging.
import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distDir = path.resolve('dist');

/** @param {string} filename */
export function isStoryOrDocsArtifact(filename) {
	return filename.includes('.stories.') || filename.endsWith('.mdx');
}

/** @param {string} dir */
async function walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walk(full);
		} else if (isStoryOrDocsArtifact(entry.name)) {
			await rm(full);
		}
	}
}

async function main() {
	if (!existsSync(distDir)) {
		console.error(
			`clean-dist-stories: expected '${distDir}' to exist (svelte-package should have created it). Nothing to clean, but that's unexpected — check the build step above.`
		);
		process.exit(1);
	}

	await walk(distDir);
}

// Guarded the same way as check-story-coverage.mjs — importing this module
// for `isStoryOrDocsArtifact` (as its own test does) must not also run the
// cleanup/exit side effect.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
