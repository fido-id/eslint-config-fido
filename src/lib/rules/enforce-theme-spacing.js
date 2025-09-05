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
];

function checkStyleObject(context, styleObject) {
  styleObject.properties.forEach((prop) => {
    if (
      prop.type === "Property" &&
      prop.key.type === "Identifier" &&
      disallowedProps.includes(prop.key.name)
    ) {
      const val = prop.value;

      // numerico o stringa hard-coded
      if (
        val.type === "Literal" &&
        (typeof val.value === "number" || typeof val.value === "string")
      ) {
        context.report({
          node: prop,
          messageId: "requireThemeSpacing",
          data: { prop: prop.key.name },
        });
      }

      // call expression ma non theme.spacing(...)
      if (val.type === "CallExpression") {
        if (
          !(
            val.callee.type === "MemberExpression" &&
            val.callee.object.name === "theme" &&
            val.callee.property.name === "spacing"
          )
        ) {
          context.report({
            node: prop,
            messageId: "requireThemeSpacing",
            data: { prop: prop.key.name },
          });
        }
      }
    }
  });
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
    },
  },
  create(context) {
    return {
      // <Box style={{ ... }} />
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

      // styled(Box)({ padding: 16 })
      CallExpression(node) {
        if (
          node.callee.type === "CallExpression" &&
          node.callee.callee.name === "styled" &&
          node.arguments.length > 0
        ) {
          const arg = node.arguments[0];
          if (arg.type === "ObjectExpression") {
            checkStyleObject(context, arg);
          }
        }
      },

      // styled.div({ padding: 16 })
      MemberExpression(node) {
        if (
          node.object &&
          node.object.name === "styled" &&
          node.parent &&
          node.parent.type === "CallExpression"
        ) {
          const callExpr = node.parent;
          if (callExpr.arguments.length > 0) {
            const arg = callExpr.arguments[0];
            if (arg.type === "ObjectExpression") {
              checkStyleObject(context, arg);
            }
          }
        }
      },
    };
  },
};
