const tfPlugin = require('./src/index');

module.exports = [
  ...tfPlugin.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    }
  }
];
