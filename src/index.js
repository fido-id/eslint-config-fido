const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintTsEslint = require('typescript-eslint');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const reactJSXRuntime = require('eslint-plugin-react/configs/jsx-runtime');
const globals = require('globals');

const pkg = require('../package.json');

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
};

Object.assign(plugin.configs, {
  recommended: [
    eslintPluginPrettierRecommended,
    ...eslintTsEslint.configs.recommended,
    reactRecommended,
    reactJSXRuntime,
    {
      plugins: {
        plugin,
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
      languageOptions: {
        ...reactRecommended.languageOptions,
        globals: {
          ...globals.serviceworker,
          ...globals.browser,
        },
      },
    },
  ],
});

module.exports = plugin;
