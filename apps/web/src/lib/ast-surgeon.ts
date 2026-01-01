import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export interface LayoutPatch {
  width?: string;
  height?: string;
  top?: string;
  left?: string;
}

/**
 * Applies layout patches (position/size) to a React component by modifying
 * the style attribute of elements with matching data-enigma-id attributes.
 *
 * @param sourceCode - The source code of the React component
 * @param targetId - The value of data-enigma-id to target
 * @param patch - The layout changes to apply
 * @returns Updated source code
 */
export async function applyLayoutPatch(
  sourceCode: string,
  targetId: string,
  patch: LayoutPatch
): Promise<string> {
  try {
    // Parse the source code into an AST
    const ast = parse(sourceCode, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    let modified = false;

    // Traverse the AST to find the target element
    traverse(ast, {
      JSXOpeningElement(path) {
        // Find elements with data-enigma-id attribute matching our target
        const dataEnigmaIdAttr = path.node.attributes.find((attr): attr is t.JSXAttribute =>
          t.isJSXAttribute(attr) &&
          attr.name.name === "data-enigma-id" &&
          t.isStringLiteral(attr.value) &&
          attr.value.value === targetId
        );

        if (!dataEnigmaIdAttr) return;

        // Find or create the style attribute
        let styleAttr = path.node.attributes.find((attr): attr is t.JSXAttribute =>
          t.isJSXAttribute(attr) && attr.name.name === "style"
        );

        // Prepare style object with existing values + new patches
        const styleObject: Record<string, string> = {};

        // Extract existing style values if present
        if (styleAttr && t.isJSXExpressionContainer(styleAttr.value)) {
          if (t.isObjectExpression(styleAttr.value.expression)) {
            styleAttr.value.expression.properties.forEach((prop) => {
              if (
                t.isObjectProperty(prop) &&
                t.isStringLiteral(prop.key) &&
                t.isStringLiteral(prop.value)
              ) {
                styleObject[prop.key.value] = prop.value.value;
              }
            });
          }
        }

        // Apply new patches
        if (patch.width) styleObject.width = patch.width;
        if (patch.height) styleObject.height = patch.height;
        if (patch.top) styleObject.top = patch.top;
        if (patch.left) styleObject.left = patch.left;

        // Create the style object expression
        const properties = Object.entries(styleObject).map(([key, value]) => {
          return t.objectProperty(
            t.stringLiteral(key),
            t.stringLiteral(value)
          );
        });

        const styleExpression = t.objectExpression(properties);

        // Update or create style attribute
        if (styleAttr) {
          styleAttr.value = t.jsxExpressionContainer(styleExpression);
        } else {
          // Insert new style attribute as the first attribute
          path.node.attributes.unshift(
            t.jsxAttribute(
              t.jsxIdentifier("style"),
              t.jsxExpressionContainer(styleExpression)
            )
          );
        }

        modified = true;

        // Stop traversal after finding and modifying the target
        path.stop();
      },
    });

    if (!modified) {
      console.warn(`[ast-surgeon] Element with data-enigma-id="${targetId}" not found`);
    }

    // Generate code from the modified AST
    // @ts-ignore - Babel's generator types are incomplete
    const { code } = await import("@babel/generator").then(({ default: generate }) =>
      generate(ast, {
        jsescOption: {
          quotes: "double",
        },
      })
    );

    return code;
  } catch (error) {
    console.error("[ast-surgeon] Failed to apply patch:", error);
    throw new Error(`Failed to apply layout patch: ${error}`);
  }
}
