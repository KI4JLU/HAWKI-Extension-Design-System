import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/svelte';
import * as previewAnnotations from './preview';

const project = setProjectAnnotations([previewAnnotations]);

beforeAll(project.beforeAll);
