import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores(['.next', 'out', 'build', 'next-env.d.ts']),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: { import: importPlugin },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'desc',
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },
  },
];

export default eslintConfig;
