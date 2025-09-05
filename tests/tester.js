const { RuleTester } = require("eslint");
const tsParser = require("@typescript-eslint/parser");

module.exports = {
  tester: new RuleTester({
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          globalReturn: false,
          jsx: true,
        },
      },
    },
  }),
};
