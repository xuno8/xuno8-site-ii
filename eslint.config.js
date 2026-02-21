import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  ...eslintPluginAstro.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Vue + TypeScript
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  // Astro + TypeScript
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        ImageMetadata: 'readonly',
      },
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },

  // Astro inline scripts（pre-hydration 等 is:inline script）
  {
    files: ['**/*.astro/*.js', '*.astro/*.js', '**/*.astro/*.ts', '*.astro/*.ts'],
    rules: {
      'no-var': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // 忽略產出目錄
  {
    ignores: ['dist/', '.astro/', '.vercel/', 'node_modules/'],
  },

  // Prettier 必須放最後
  eslintConfigPrettier,
];
