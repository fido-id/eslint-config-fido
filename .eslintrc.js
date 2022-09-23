module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
        printWidth: 120,
        trailingComma: 'all',
      },
    ],
  },
};
