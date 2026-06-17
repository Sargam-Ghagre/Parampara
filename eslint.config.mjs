import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // 1. Apply recommended JavaScript rules
  js.configs.recommended,

  // 2. Turn off rules that conflict with Prettier
  prettier,

  // 3. Main configuration object
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        PARAMPARA_TRANSLATIONS: 'writable',
        translations: 'writable',
        maplibregl: 'readonly',
        translatePage: 'writable',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Treats Prettier formatting issues as ESLint errors
      'no-unused-vars': [
        'warn',
        {
          vars: 'local',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'off',
    },
  },
];
