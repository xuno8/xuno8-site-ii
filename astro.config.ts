import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import UnoCSS from 'unocss/astro';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  output: 'static',
  integrations: [vue(), UnoCSS({ injectReset: true })],
  vite: {
    plugins: [yaml()],
  },
});
