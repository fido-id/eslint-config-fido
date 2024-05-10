# eslint-config-fido

Shared ESLint configs for React projects.

## Installation

```sh
yarn add --dev @fido.id/eslint-config-fido
```

You will also need to install `eslint` and `prettier`:

```sh
yarn add --dev eslint prettier
```

## Usage

### eslint.config.js

```js
const fido = require("@fido.id/eslint-config-fido");
module.exports = [
  ...fido.configs.recommended,
  {
    rules: {
      ...
    },
  },
];
```

## Customizing Prettier

If you would like to customize the Prettier settings, create a file named `.prettierrc` in your project directory. This file must declare a Prettier configuration like this:

```js
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "jsxBracketSameLine": true,
  "trailingComma": "es5"
}
```

## Philosophy

This config is designed to mark severe problems (ex: syntax errors) as errors and stylistic issues as warnings. This lets your team apply policies like, "make sure a commit has no errors but ignore warnings if the commit didn't introduce them."

It's also designed to be a more lenient config for teams who are stronger at decision-making and have a culture of osmotically learning coding guidelines and benefit more from flexibility than rigid rules.