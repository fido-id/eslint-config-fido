const { RuleTester } = require("eslint");
const rule = require("../../../src/lib/rules/prefer-early-returns");

const tester = new RuleTester({
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
});

tester.run("prefer-early-return", rule, {
  valid: [
    // if withtout else
    `function f(a){ if (!a) return; doWork(a); }`,

    // nested ifs but without else
    `
      function g(a,b){
        if (!a) return;
        if (!b) return;
        run(a,b);
      }
    `,

    // normal else with non-if content (we do not force its removal with this rule)
    `
      function h(x){
        if (x > 0) doA();
        else doB();
      }
    `,
  ],

  invalid: [
    // else if
    {
      code: `
        function f(a,b){
          if (a > 0) { doA(); }
          else if (b > 0) { doB(); }
          else { doC(); }
        }
      `,
      errors: [{ messageId: "noElseIf" }],
    },

    // else { if (...) { ... } }
    {
      code: `
        function g(a,b){
          if (a > 0) {
            doA();
          } else {
            if (b > 0) {
              doB();
            }
          }
        }
      `,
      errors: [{ messageId: "noElseBlockIf" }],
    },

    // compact variant
    {
      code: `
        if (cond) foo(); else { if (other) bar(); }
      `,
      errors: [{ messageId: "noElseBlockIf" }],
    },
  ],
});
