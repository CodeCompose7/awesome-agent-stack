// @ts-check
// Site-level config only — routes, components, markdown pipeline and styling
// all come from the stack-site-builder theme. See packages/stack-site-builder/index.mjs.
import { defineConfig } from 'astro/config';
import aasTheme from 'stack-site-builder';
import { glossary } from './src/data/glossary.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://codecompose7.github.io',
  base: '/awesome-ai-image-stack',

  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [aasTheme({ glossary })],
});
