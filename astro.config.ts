import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import UnoCSS from 'unocss/astro';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [vue(), UnoCSS({ injectReset: true })],
  vite: {
    plugins: [yaml()],
  },
});
