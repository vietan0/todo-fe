import antfu from '@antfu/eslint-config';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';

export default antfu(
  {
    stylistic: {
      semi: true,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'style/padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'export'],
        },
        {
          blankLine: 'never',
          prev: 'export',
          next: 'export',
        },
        {
          blankLine: 'always',
          prev: 'import',
          next: ['const', 'let', 'function', 'block-like', 'interface'],
        },
        {
          blankLine: 'always',
          prev: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'multiline-expression',
            'multiline-block-like',
            'multiline-const',
            'interface',
          ],
        },
        {
          blankLine: 'never',
          prev: ['singleline-const', 'singleline-let', 'singleline-var'],
          next: ['singleline-const', 'singleline-let', 'singleline-var'],
        },
      ],
      'perfectionist/sort-jsx-props': 'error',
      'test/consistent-test-it': ['error', { fn: 'test' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'warn',
    },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
  },
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      'better-tailwindcss/enforce-consistent-class-order': ['warn', {
        callees: ['cc', 'clb', 'clsx', 'cn', 'cnb', 'ctl', 'cva', 'cx', 'dcnb', 'objstr', 'tv', 'twJoin', 'twMerge'],
      }],
      'better-tailwindcss/no-unregistered-classes': ['warn', {
        ignore: ['task-body-truncated', 'task-modal-name'],
      }],
    },
    settings: {
      'better-tailwindcss': {
        callees: ['classnames', 'clsx', 'ctl', 'cva', 'tv'],
        entryPoint: 'src/index.css',
      },
    },
  },
  {
    files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      'testing-library/no-debugging-utils': 'off',
      'testing-library/no-manual-cleanup': 'off',
      'testing-library/no-render-in-lifecycle': 'off',
    },
  },
  ...pluginQuery.configs['flat/recommended'],
);
