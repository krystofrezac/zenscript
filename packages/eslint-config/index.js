module.exports = {
  env: {
    node: true,
  },
  plugins: [
    'vitest',
    '@typescript-eslint',
    'prefer-arrow-functions',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vitest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'spaced-comment': ['error', 'always'],

    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSpacing: true,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        tabWidth: 2,
        useTabs: false,
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],

    'prefer-arrow-functions/prefer-arrow-functions': [
      'error',
      {
        returnStyle: 'implicit',
      },
    ],

    'vitest/consistent-test-it': [
      'error',
      {
        fn: 'test',
        withinDescribe: 'test',
      },
    ],
    'vitest/no-focused-tests': 'error',
    'vitest/no-disabled-tests': 'error',
  },
};
