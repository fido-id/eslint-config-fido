const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const eslintTsEslint = require("typescript-eslint");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const reactJSXRuntime = require("eslint-plugin-react/configs/jsx-runtime");
const globals = require("globals");

const pkg = require("../package.json");

// local rules
const noNestedTernaryInside = require("./lib/rules/no-nested-ternary-operators");
const preferEarlyReturns = require("./lib/rules/prefer-early-returns");

const plugin = {
  meta: { name: pkg.name, version: pkg.version, namespace: "tf" },
  configs: {},
  rules: {
    "no-nested-ternary-inside": noNestedTernaryInside,
    "prefer-early-returns": preferEarlyReturns,
  },
};

const pluginRegistration = {
  plugins: {
    tf: plugin,
  },
  rules: {
    // Custom rules
    [`tf/no-nested-ternary-inside`]: "error",
    [`tf/prefer-early-returns`]: "error",

    // Base rules
    "@typescript-eslint/consistent-type-assertions": "warn",
    "no-promise-executor-return": "warn",
    "max-params": "warn",
    "react/no-namespace": "off",
    "react/iframe-missing-sandbox": "off",
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/display-name": "warn",
    "react/no-unescaped-entities": "off",
  },
  languageOptions: {
    ...reactRecommended.languageOptions,
    globals: {
      ...globals.serviceworker,
      ...globals.browser,
    },
  },
};

Object.assign(plugin.configs, {
  recommended: [
    eslintPluginPrettierRecommended,
    ...eslintTsEslint.configs.recommended,
    reactRecommended,
    reactJSXRuntime,
    pluginRegistration,
  ],
});

module.exports = plugin;
