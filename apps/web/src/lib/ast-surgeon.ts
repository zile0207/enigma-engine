import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import MagicString from "magic-string";

export async function applyLayoutPatch(
  sourceCode: string,
  targetId: string,
  patch: { width?: string; height?: string; top?: string; left?: string }
) {
  const s = new MagicString(sourceCode);
  const ast = parse(sourceCode, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    JSXOpeningElement(path) {
      // Find the element with the matching data-enigma-id
      const idAttr = path.node.attributes.find(
        (attr): attr is t.JSXAttribute =>
          t.isJSXAttribute(attr) &&
          attr.name.name === "data-enigma-id" &&
          t.isStringLiteral(attr.value) &&
          attr.value.value === targetId
      );

      if (idAttr) {
        // Find or create the 'style' attribute
        const styleAttr = path.node.attributes.find(
          (attr): attr is t.JSXAttribute =>
            t.isJSXAttribute(attr) && attr.name.name === "style"
        );

        if (
          styleAttr &&
          t.isJSXExpressionContainer(styleAttr.value) &&
          t.isObjectExpression(styleAttr.value.expression)
        ) {
          const start = styleAttr.value.expression.start!;
          const end = styleAttr.value.expression.end!;

          // Generate the new style object string
          const newStyle = `{\n      position: "absolute",\n      top: "${patch.top}",\n      left: "${patch.left}",\n      width: "${patch.width}",\n      height: "${patch.height}"\n    }`;

          s.overwrite(start, end, newStyle);
        }
      }
    },
  });

  return s.toString();
}
