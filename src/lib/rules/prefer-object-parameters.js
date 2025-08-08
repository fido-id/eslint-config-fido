/**
 * Rule: Prefer Object Parameters for Functions with Multiple Arguments
 *
 * When a function requires many parameters (more than N), prefer a single object parameter
 * with named properties instead of multiple positional arguments.
 *
 * Options:
 * {
 *   max: number = 4,                  // threshold above which to warn
 *   checkDefinitions: boolean = true, // check function/method definitions
 *   checkCalls: boolean = true,       // check function/method calls
 *   ignoreMethods: boolean = false,   // skip methods
 *   ignoreCallees: string[] = []      // names to ignore in calls (e.g., ["console.log"])
 * }
 */

"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer a single object parameter when functions take many parameters, to improve readability and extensibility.",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "integer", minimum: 1 },
          checkDefinitions: { type: "boolean" },
          checkCalls: { type: "boolean" },
          ignoreMethods: { type: "boolean" },
          ignoreCallees: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyParamsDef:
        "Function has {{count}} parameters. Prefer a single object parameter with named properties (max {{max}}).",
      tooManyArgsCall:
        "Call passes {{count}} arguments. Prefer passing a single object with named properties (max {{max}}).",
    },
  },

  create(context) {
    const opts = context.options[0] || {};
    const max = Number.isInteger(opts.max) ? opts.max : 4;
    const checkDefinitions =
      opts.checkDefinitions === undefined
        ? true
        : Boolean(opts.checkDefinitions);
    const checkCalls =
      opts.checkCalls === undefined ? true : Boolean(opts.checkCalls);
    const ignoreMethods = Boolean(opts.ignoreMethods);
    const ignoreCallees = Array.isArray(opts.ignoreCallees)
      ? opts.ignoreCallees
      : [];

    function isSingleObjectParam(params) {
      // Allow if there is exactly one parameter (identifier or object destructuring)
      return params.length === 1;
    }

    function reportIfTooManyParams(node, params, isMethod) {
      if (!checkDefinitions) return;
      if (ignoreMethods && isMethod) return;

      const count = params.length;
      if (count > max && !isSingleObjectParam(params)) {
        context.report({
          node,
          messageId: "tooManyParamsDef",
          data: { count, max },
        });
      }
    }

    function calleeToString(callee) {
      // Build a string representation of the callee, e.g., foo, obj.method, console.log
      try {
        if (callee.type === "Identifier") return callee.name;
        if (callee.type === "MemberExpression") {
          const parts = [];
          let cur = callee;
          while (cur) {
            if (cur.property && cur.property.type === "Identifier") {
              parts.unshift(cur.property.name);
            }
            if (cur.object && cur.object.type === "Identifier") {
              parts.unshift(cur.object.name);
              break;
            }
            cur =
              cur.object && cur.object.type === "MemberExpression"
                ? cur.object
                : null;
          }
          return parts.join(".");
        }
      } catch {}
      return "";
    }

    function reportIfTooManyArgs(node, args) {
      if (!checkCalls) return;

      const count = args.length;
      if (count > max) {
        const name = calleeToString(node.callee || node);
        if (name && ignoreCallees.includes(name)) return;

        context.report({
          node,
          messageId: "tooManyArgsCall",
          data: { count, max },
        });
      }
    }

    return {
      FunctionDeclaration(node) {
        reportIfTooManyParams(node, node.params, false);
      },
      FunctionExpression(node) {
        reportIfTooManyParams(node, node.params, false);
      },
      ArrowFunctionExpression(node) {
        reportIfTooManyParams(node, node.params, false);
      },
      MethodDefinition(node) {
        reportIfTooManyParams(node, node.value.params, true);
      },
      Property(node) {
        if (
          node.method &&
          node.value &&
          node.value.type === "FunctionExpression"
        ) {
          reportIfTooManyParams(node, node.value.params, true);
        }
      },
      CallExpression(node) {
        reportIfTooManyArgs(node, node.arguments);
      },
      NewExpression(node) {
        reportIfTooManyArgs(node, node.arguments || []);
      },
    };
  },
};
