const { FlatCompat } = require('@eslint/eslintrc');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

const compat = new FlatCompat();

module.exports = [
  ...compat.extends('eslint-config-standard'),
  eslintPluginPrettierRecommended,
  {
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
  },
];
