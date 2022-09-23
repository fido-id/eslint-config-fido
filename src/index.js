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
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
