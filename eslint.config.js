import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/**
 * Flat ESLint config for the Relay workspace.
 *
 * The rules that matter most here are the boundary rules at the bottom: they are what keep
 * publishing logic out of React components and provider payload shapes out of the UI.
 */
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/generated/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/*.d.ts',
      'packages/database/prisma/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2023 },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      eqeqeq: ['error', 'smart'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSNonNullExpression',
          message:
            'Non-null assertions hide real absence. Narrow the type or throw a RelayError instead.',
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: 'Use the clock from @relay/contracts so time can be faked in tests.' },
      ],
    },
  },

  // Shipped code must not print to stdout. The logger redacts; console does not.
  {
    files: ['**/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', 'apps/cli/**', 'packages/database/src/seed.ts', '**/scripts/**'],
    rules: {
      'no-console': 'error',
    },
  },

  // Dependency direction. See AGENTS.md "Dependency direction".
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@relay/database', '@relay/database/*'],
              message:
                'The web app must not reach the database directly. Call an application service through the API.',
            },
            {
              group: ['@relay/connectors', '@relay/connectors/*'],
              message:
                'React components must not know provider payload shapes. Consume normalized view models from @relay/contracts.',
            },
            {
              group: ['**/src/**'],
              message: 'Import a package public entrypoint, not its internals.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/design-system/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@relay/*', '!@relay/i18n'],
              message:
                'The design system may only depend on react and @relay/i18n. Keep it product-agnostic.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/contracts/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@relay/*'], message: '@relay/contracts is the root of the dependency graph.' },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/vitest.config.ts', '**/*.config.{ts,js,mjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
    },
  },
);
