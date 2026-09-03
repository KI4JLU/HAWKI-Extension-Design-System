import type { Preview } from '@storybook/svelte-vite';
import '../src/lib/styles/full.css';

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
