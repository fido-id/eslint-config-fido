const { tester } = require("../../tester");
const rule = require("../../../src/lib/rules/enforce-theme-spacing");

tester.run("enforce-theme-spacing", rule, {
  valid: [
    `<Box style={{ gap: theme.spacing(2) }} />`,
    `<Box style={{ padding: theme.spacing(2) }} />`,
    `<Box sx={{ marginTop: theme.spacing(1) }} />`,
    `<Box sx={{ marginTop: theme.spacing(1.5) }} />`,
    `const MyBox = styled(Box)({ padding: theme.spacing(2) });`,
    `const Div = styled.div({ margin: theme.spacing(2) });`,
    `const FuncBox = styled(Box)(() => ({ padding: theme.spacing(2) }));`,
    `const BlockBox = styled(Box)(() => { return { marginTop: theme.spacing(3) }; });`,
  ],
  invalid: [
    {
      code: `<Box style={{ padding: 16 }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `<Box style={{ gap: 16 }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `<Box style={{ gap: theme.spacing(1.2) }} />`,
      errors: [{ messageId: "invalidThemeSpacingValue" }],
    },
    {
      code: `<Box sx={{ marginTop: "20px" }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `const MyBox = styled(Box)({ padding: 10 });`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `const Div = styled.div({ marginBottom: "8px" });`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `const StyledBigButton = styled(Button)(() => ({ marginTop: 8 }));`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `const BlockBox = styled(Box)(() => { return { padding: 12 }; });`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
    {
      code: `<Box style={{ margin: someVar }} />`,
      errors: [{ messageId: "requireThemeSpacing" }],
    },
  ],
});
