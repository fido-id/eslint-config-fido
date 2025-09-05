const neostandard = require("neostandard");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const eslintTsEslint = require("typescript-eslint");
const globals = require("globals");

const pkg = require("../package.json");

// local rules
const noNestedTernaryOperators = require("./lib/rules/no-nested-ternary-operators");
const correctVariantTypography = require("./lib/rules/correct-variant-typography");
const noExplicitAs = require("./lib/rules/no-explicit-as");
const enforceThemeSpacing = require("./lib/rules/enforce-theme-spacing");
const preferEarlyReturns = require("./lib/rules/prefer-early-returns");
const preferObjectParameters = require("./lib/rules/prefer-object-parameters");
const muiPreferComponents = require("./lib/rules/mui-prefer-components");

// React configs (only used in the "react" preset)
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const reactJSXRuntime = require("eslint-plugin-react/configs/jsx-runtime");

const plugin = {
  meta: { name: pkg.name, version: pkg.version, namespace: "tf" },
  configs: {},
  rules: {
    "no-nested-ternary-operators": noNestedTernaryOperators,
    "prefer-early-returns": preferEarlyReturns,
    "prefer-object-parameters": preferObjectParameters,
    "mui-prefer-components": muiPreferComponents,
    "correct-variant-typography": correctVariantTypography,
    "no-explicit-as": noExplicitAs,
    "enforce-theme-spacing": enforceThemeSpacing,
  },
};

// --- Base config (no React) --------------------------------------------------
const baseRegistration = {
  plugins: {
    [plugin.meta.namespace]: plugin,
  },
  rules: {
    // Custom rules
    "tf/no-nested-ternary-operators": "error",
    "tf/prefer-early-returns": "error",
    "tf/prefer-object-parameters": "error",
    "tf/correct-variant-typography": "error",
    "tf/no-explicit-as": "error",
    "tf/enforce-theme-spacing": "error",
    // General TypeScript/JavaScript rules (no react/* rules here)
    "@typescript-eslint/consistent-type-assertions": "warn",
    "no-promise-executor-return": "warn",
    "max-params": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "warn",
  },
  languageOptions: {
    // Global variables available in browser and service worker environments
    globals: {
      ...globals.browser,
      ...globals.serviceworker,
    },
  },
};

// --- React config (extends base + adds React rules) --------------------------
const reactRegistration = {
  ...baseRegistration,
  rules: {
    ...baseRegistration.rules,

    // React-specific overrides
    "react/no-namespace": "off",
    "react/iframe-missing-sandbox": "off",
    "react/no-unescaped-entities": "off",

    // Custom rules
    "tf/mui-prefer-components": "error",
  },
};

Object.assign(plugin.configs, {
  recommended: [
    eslintPluginPrettierRecommended,
    ...eslintTsEslint.configs.strict,
    ...neostandard({
      noStyle: true,
      noJsx: true,
    }),
    baseRegistration,
  ],
  react: [
    eslintPluginPrettierRecommended,
    ...eslintTsEslint.configs.strict,
    ...neostandard({
      noStyle: true,
    }),
    reactRecommended,
    reactJSXRuntime,
    reactRegistration,
  ],
});

module.exports = plugin;
