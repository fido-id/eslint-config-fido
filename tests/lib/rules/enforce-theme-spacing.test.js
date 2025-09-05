const { tester } = require("../../tester");
const rule = require("../../../src/lib/rules/enforce-theme-spacing");

tester.run("enforce-theme-spacing", rule, {
  valid: [
    { code: `<Box style={{ padding: theme.spacing(2) }} />` },
    { code: `<Element style={{ marginTop: theme.spacing(1) }} />` },
     { code: `<Element sx={{ marginTop: theme.spacing(1) }} />` },
    { code: `<Box style={{ padding: theme.spacing(4), margin: theme.spacing(2) }} />` },
  ],
  invalid: [
    {
      code: `<Typography style={{ padding: 16 }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `<div sx={{ padding: 16 }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `<Element style={{ marginTop: "10px" }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
   
  ],
});
