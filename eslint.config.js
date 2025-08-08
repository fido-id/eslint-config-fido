const { FlatCompat } = require('@eslint/eslintrc');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

const compat = new FlatCompat();
const tfPlugin = require('./src/index');

module.exports = [
  ...compat.extends('eslint-config-standard'),
  ...tfPlugin.configs.recommended
];
