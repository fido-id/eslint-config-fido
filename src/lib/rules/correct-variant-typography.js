const VALID_REGEX = /^\d{2}_\d{3}$/;

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce Typography variant format XX_YYY and disallow fontSize/fontWeight in style or sx",
      recommended: false,
    },
    schema: [],
    messages: {
      invalidVariant:
        "Typography variant '{{variant}}' is invalid. Use the format 'XX_YYY' (e.g., '12_400').",
      forbiddenFontStyle:
        "Do not set '{{prop}}' via style or sx. Use Typography variant instead.",
    },
  },
  create(context) {
    const forbiddenStyleProps = ["fontSize", "fontWeight"];

    function checkForbiddenStyle(node) {
      if (
        node.value &&
        node.value.expression &&
        node.value.expression.type === "ObjectExpression"
      ) {
        node.value.expression.properties.forEach((prop) => {
          if (
            prop.type === "Property" &&
            prop.key.type === "Identifier" &&
            forbiddenStyleProps.includes(prop.key.name)
          ) {
            context.report({
              node: prop,
              messageId: "forbiddenFontStyle",
              data: { prop: prop.key.name },
            });
          }
        });
      }
    }

    return {
      JSXOpeningElement(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "Typography"
        ) {
          const variantAttr = node.attributes.find(
            (attr) =>
              attr.type === "JSXAttribute" && attr.name.name === "variant",
          );

          if (
            variantAttr &&
            variantAttr.value &&
            variantAttr.value.type === "Literal"
          ) {
            const variantValue = variantAttr.value.value;

            if (!VALID_REGEX.test(variantValue)) {
              context.report({
                node: variantAttr,
                messageId: "invalidVariant",
                data: { variant: variantValue },
              });
            }
          }

          node.attributes.forEach((attr) => {
            if (
              attr.type === "JSXAttribute" &&
              attr.name &&
              (attr.name.name === "style" || attr.name.name === "sx")
            ) {
              checkForbiddenStyle(attr);
            }
          });
        }
      },
    };
  },
};
