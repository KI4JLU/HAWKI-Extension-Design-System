// svelte-package ships everything under src/lib verbatim — it has no
// built-in exclusion for *.stories.* / *.mdx (removed along with
// config.package, see https://github.com/sveltejs/kit/pull/8922). Stories
// stay colocated with their component (the Storybook convention this
// library follows), so the cleanup happens here instead, after packaging.
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');

async function walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walk(full);
		} else if (entry.name.includes('.stories.') || entry.name.endsWith('.mdx')) {
			await rm(full);
		}
	}
}

await walk(distDir);
