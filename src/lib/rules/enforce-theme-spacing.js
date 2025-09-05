const disallowedProps = [
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "gap",
];

function checkStyleObject(context, styleObject) {
  styleObject.properties.forEach((prop) => {
    if (
      prop.type === "Property" &&
      prop.key.type === "Identifier" &&
      disallowedProps.includes(prop.key.name)
    ) {
      const val = prop.value;
      let isThemeSpacing = false;

      // theme.spacing(...)
      if (
        val.type === "CallExpression" &&
        val.callee.type === "MemberExpression" &&
        val.callee.object.name === "theme" &&
        val.callee.property.name === "spacing"
      ) {
        isThemeSpacing = true;

        // controllo argomento
        if (val.arguments.length === 1) {
          const arg = val.arguments[0];
          if (arg.type === "Literal" && typeof arg.value === "number") {
            const num = arg.value;
            const valid = num % 0.5 === 0;
            if (!valid) {
              context.report({
                node: arg,
                messageId: "invalidThemeSpacingValue",
                data: { prop: prop.key.name, value: num },
              });
            }
          }
        }
      }

      if (!isThemeSpacing) {
        context.report({
          node: prop,
          messageId: "requireThemeSpacing",
          data: { prop: prop.key.name },
        });
      }
    }
  });
}

function checkStyledArg(context, arg) {
  if (!arg) return;

  if (arg.type === "ObjectExpression") {
    checkStyleObject(context, arg);
  }

  if (
    arg.type === "ArrowFunctionExpression" ||
    arg.type === "FunctionExpression"
  ) {
    if (arg.body.type === "ObjectExpression") {
      checkStyleObject(context, arg.body);
    }

    if (arg.body.type === "BlockStatement") {
      arg.body.body.forEach((stmt) => {
        if (
          stmt.type === "ReturnStatement" &&
          stmt.argument &&
          stmt.argument.type === "ObjectExpression"
        ) {
          checkStyleObject(context, stmt.argument);
        }
      });
    }
  }
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce use of theme.spacing() for margin and padding in style, sx, and styled components",
      recommended: false,
    },
    schema: [],
    messages: {
      requireThemeSpacing:
        "Avoid hard-coded '{{prop}}'. Use theme.spacing(n) instead.",
      invalidThemeSpacingValue: "Only value like 0.5, 1,1.5 are allowed",
    },
  },
  create(context) {
    return {
      // JSX style / sx
      JSXAttribute(node) {
        if (
          (node.name.name === "style" || node.name.name === "sx") &&
          node.value &&
          node.value.expression &&
          node.value.expression.type === "ObjectExpression"
        ) {
          checkStyleObject(context, node.value.expression);
        }
      },

      // styled(...)({ ... }) o styled.div({ ... })
      CallExpression(node) {
        const callee = node.callee;

        const isStyledCall =
          (callee.type === "CallExpression" &&
            callee.callee.name === "styled") ||
          (callee.type === "MemberExpression" &&
            callee.object.name === "styled");

        if (!isStyledCall) return;

        node.arguments.forEach((arg) => checkStyledArg(context, arg));
      },
    };
  },
};
