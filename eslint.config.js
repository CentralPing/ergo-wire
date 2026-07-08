import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'types/**']
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
        ...globals.browser,
        crypto: 'readonly'
      }
    },
    rules: {
      'no-use-before-define': ['error', {functions: false}],
      'no-param-reassign': ['error', {props: false}],
      'no-console': 'warn',
      'new-cap': 'off',
      'no-plusplus': 'off'
    }
  },
  prettierConfig
];
