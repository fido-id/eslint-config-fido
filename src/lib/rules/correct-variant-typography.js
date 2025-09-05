// eslint-plugin-typography-variant/rules/variant-format.ts

const VALID_REGEX = /^\d{2}_\d{3}$/;

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce Typography variant format XX_YYY",
      recommended: false,
    },
    schema: [],
    messages: {
      invalidVariant:
        "Typography variant '{{variant}}' is invalid. Use the format 'XX_YYY' (e.g., '12_400').",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
      
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "Typography"
        ) {
          const variantAttr = node.attributes.find(
            (attr) =>
              attr.type === "JSXAttribute" && attr.name.name === "variant"
          );

          if (variantAttr && variantAttr.value?.type === "Literal") {
            const variantValue = variantAttr.value.value;

            if (!VALID_REGEX.test(variantValue)) {
              context.report({
                node: variantAttr,
                messageId: "invalidVariant",
                data: { variant: variantValue },
              });
            }
          }
        }
      },
    };
  },
};
