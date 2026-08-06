import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
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
    },
  },

  // Shipped code must not print to stdout. The logger redacts; console does not.
  {
    files: ['**/src/**/*.{ts,tsx}'],
    ignores: [
      '**/*.test.{ts,tsx}',
      'apps/cli/**',
      'packages/database/src/seed.ts',
      '**/scripts/**',
    ],
    rules: {
      'no-console': 'error',
    },
  },

  // Nest resolves constructor dependencies from `design:paramtypes`, which only
  // exists for imports that survive to runtime. Rewriting an injected class to
  // `import type` erases it and the provider silently fails to resolve, so this
  // rule cannot run over the API.
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },

  // Scheduling, publishing, billing and metric freshness are only testable when
  // time is injected. The concern is reading the current time ambiently, not the
  // Date type: parsing and arithmetic on an explicit instant are fine. A clock
  // implementation, a seed, a migration and a process entrypoint have no clock to
  // take, so they are outside this boundary.
  {
    files: [
      'packages/application/src/**/*.ts',
      'packages/connectors/src/**/*.ts',
      'packages/billing/src/**/*.ts',
      'packages/ai/src/**/*.ts',
      'packages/analytics-domain/src/**/*.ts',
      'apps/worker/src/workflows/**/*.ts',
      'apps/api/src/modules/**/*.ts',
    ],
    ignores: [
      '**/*.test.ts',
      '**/testing/**',
      // These define the clock everything else injects, so they are the one place
      // that is allowed to read the real time.
      '**/clock.ts',
      '**/ports.ts',
      'packages/analytics-domain/src/time.ts',
      'apps/worker/src/workflows/temporal-runtime.ts',
      '**/fixtures.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSNonNullExpression',
          message:
            'Non-null assertions hide real absence. Narrow the type or throw a RelayError instead.',
        },
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message:
            'Reading the current time ambiently is untestable. Take a Clock and call clock.now().',
        },
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message:
            'Reading the current time ambiently is untestable. Take a Clock and call clock.now().',
        },
      ],
    },
  },

  // Dependency direction. See AGENTS.md "Dependency direction".
  // React and Next rules for the product surface. Without these plugins the
  // inline disables in the codebase reference rules that do not exist, which is
  // itself an error, and the real checks never run.
  {
    files: ['apps/web/**/*.{tsx,ts}', 'packages/design-system/**/*.{tsx,ts}'],
    plugins: { react, 'react-hooks': reactHooks, '@next/next': next },
    settings: { react: { version: 'detect' } },
    rules: {
      // The two long standing rules, not the full React Compiler set that v7's
      // `recommended` turns on. Adopting the compiler rules is a deliberate
      // migration with its own refactors, not a side effect of installing lint.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-array-index-key': 'error',
      'react/jsx-key': 'error',
      '@next/next/no-img-element': 'warn',
    },
  },

  {
    files: ['apps/web/**/*.{ts,tsx}'],
    ignores: ['apps/web/src/components/link.tsx'],
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
            {
              group: ['next/link'],
              message:
                'Use @/components/link so internal navigation preserves the current interface locale.',
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
            {
              group: ['@relay/*'],
              message: '@relay/contracts is the root of the dependency graph.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/vitest.config.ts', '**/*.config.{ts,js,mjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // A generator double that only throws is how a test says "not supported".
      'require-yield': 'off',
      'no-console': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
    },
  },
);
