module.exports = {
  plugins: [
    'vitest',
    '@typescript-eslint',
    'prefer-arrow-functions',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vitest/all',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'spaced-comment': ['error', 'always'],

    'prettier/prettier': 'error',

    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-duplicate-enum-values': 'error',

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
    'vitest/no-skipped-tests': 'error',
    'vitest/no-disabled-tests': 'error',
  },
};
