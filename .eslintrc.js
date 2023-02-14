module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'prefer-arrow-functions', 'prettier'],
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

    'prefer-arrow-functions/prefer-arrow-functions': [
      'error',
      {
        returnStyle: 'implicit',
      },
    ],
  },
};
