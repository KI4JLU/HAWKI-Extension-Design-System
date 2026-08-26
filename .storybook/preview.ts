import type { Preview } from '@storybook/svelte-vite';

// TODO(card 08 — tokens): once the token entry points exist, import the
// styling contract's standalone entry here (`styles/full.css`, per the
// KI-568 decision record in docs/DESIGN_SYSTEM.md — Storybook has no
// pre-existing HAWKI CSS environment, so it is a "standalone" consumer and
// must use `full.css`, never `tokens.css`). Left empty on purpose rather
// than silently skipped: see card 07's own scheduling note on this.

const THEME_CLASS = 'darkMode';

function applyTheme(theme: string) {
	document.documentElement.classList.toggle(THEME_CLASS, theme === 'dark');
}

const preview: Preview = {
	parameters: {
		a11y: {
			// 'error' fails the CI run (addon-vitest picks this up); local dev
			// runs still surface violations in the Accessibility panel either way.
			test: 'error'
		}
	},
	initialGlobals: {
		theme: 'light'
	},
	globalTypes: {
		theme: {
			description: 'Theme (card 04 / KI-568: html.darkMode, no other selector)',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', icon: 'sun', title: 'Light' },
					{ value: 'dark', icon: 'moon', title: 'Dark' }
				],
				dynamicTitle: true
			}
		}
	},
	decorators: [
		(story, context) => {
			applyTheme(context.globals.theme);
			return story();
		}
	]
};

export default preview;
