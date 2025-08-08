

# eslint-config-fido

Shared ESLint configs for React projects.

> **Warning:** This package has only been tested with ESLint 8. Compatibility with other versions is not guaranteed.




## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Exported Configurations](#exported-configurations)
- [CLI Usage](#cli-usage)
- [Customizing Prettier](#customizing-prettier)
- [Custom Rules](#custom-rules)
- [Philosophy](#philosophy)



## Installation

```sh
yarn add --dev @fido.id/eslint-config-fido
```

You will also need to install `eslint` and `prettier`:

```sh
yarn add --dev eslint prettier
```


## Usage

### Exported Configurations

This package exports two main configurations:

- **recommended**: Base rules for all TypeScript projects (no React/JSX-specific rules).
- **react**: Extends the base config with additional rules for React/JSX projects.

### Example: eslint.config.js

```js
const fido = require("@fido.id/eslint-config-fido");
module.exports = [
  // For TypeScript projects:
  ...fido.configs.recommended,
  // For React/JSX projects, use:
  // ...fido.configs.react,
  {
    rules: {
      // your custom rules here
    },
  },
];
```

## CLI Usage

This package provides a CLI for running tests and linting:

- `./cli tests` — Run all tests.
- `./cli tests --fix` — Run linting and automatically fix problems.

> **Note:** The CLI requires Docker to be installed and running on your system.

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


## Custom Rules

This package provides the following custom ESLint rules:

| Rule Name | Description | Valid Example | Invalid Example | Explanation |
|-----------|-------------|---------------|-----------------|-------------|
| `no-nested-ternary-operators` | Disallow nested ternary operators for better readability. | `const x = a ? b : c;` | `const x = a ? (b ? 1 : 2) : 3;` | Nested ternaries are hard to read and should be avoided. |
| `prefer-early-returns` | Prefer early returns (guard clauses) over else-if and else blocks that only contain an if. | `function f(a){ if (!a) return; doWork(a); }` | `function f(a,b){ if (a > 0) { doA(); } else if (b > 0) { doB(); } else { doC(); } }` | Avoids deep nesting and improves code clarity by using guard clauses instead of else/else-if. |

## Philosophy

This config is designed to mark severe problems (ex: syntax errors) as errors and stylistic issues as warnings. This lets your team apply policies like, "make sure a commit has no errors but ignore warnings if the commit didn't introduce them."

It's also designed to be a more lenient config for teams who are stronger at decision-making and have a culture of osmotically learning coding guidelines and benefit more from flexibility than rigid rules.