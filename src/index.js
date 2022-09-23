module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended', 'alloy', 'alloy/react', 'alloy/typescript'],
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/consistent-type-assertions': 'warn',
    'no-promise-executor-return': 'warn',
    'max-params': 'warn',
    'react/no-namespace': 'off',
    'react/iframe-missing-sandbox': 'off',
    'react/jsx-no-useless-fragment': 'warn',
    'react/no-unescaped-entities': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
