const { RuleTester } = require("eslint");

module.exports = {
  tester: new RuleTester({
    languageOptions: {
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
