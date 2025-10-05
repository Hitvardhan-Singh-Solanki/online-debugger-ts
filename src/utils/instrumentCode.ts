import { parse } from "@babel/parser";
import * as traverse from "@babel/traverse";
import * as generate from "@babel/generator";
import * as t from "@babel/types";

// Handle both ESM and CommonJS default exports
const traverseFn = (traverse as any).default || traverse;
const generateFn = (generate as any).default || generate;

export interface TraceSnapshot {
  line: number;
  vars: Record<string, unknown>;
  callStack: string[];
}

export interface FunctionSignature {
  name: string;
  params: string[];
}

/**
 * Extract function signature from code
 */
export function extractFunctionSignature(
  code: string
): FunctionSignature | null {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    let functionInfo: FunctionSignature | null = null;

    traverseFn(ast, {
      FunctionDeclaration(path: any) {
        if (!functionInfo) {
          const params = path.node.params.map((param: any) => {
            if (t.isIdentifier(param)) {
              return param.name;
            }
            if (t.isRestElement(param) && t.isIdentifier(param.argument)) {
              return `...${param.argument.name}`;
            }
            return "param";
          });

          functionInfo = {
            name: path.node.id?.name || "anonymous",
            params,
          };
        }
      },
    });

    return functionInfo;
  } catch (error) {
    console.error("Error extracting function signature:", error);
    return null;
  }
}

/**
 * Instrument code with trace calls before and after each statement
 */
export function instrumentCode(code: string): string {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Note: getVariablesInScope was replaced with declaredVariables tracking
    // to avoid capturing uninitialized variables

    // Create trace call expression
    const createTraceCall = (
      line: number,
      vars: string[]
    ): t.ExpressionStatement => {
      const varsObject = t.objectExpression(
        vars.map((varName) =>
          t.objectProperty(
            t.identifier(varName),
            t.identifier(varName),
            false,
            true
          )
        )
      );

      return t.expressionStatement(
        t.callExpression(t.identifier("__trace"), [
          t.objectExpression([
            t.objectProperty(t.identifier("line"), t.numericLiteral(line)),
            t.objectProperty(t.identifier("vars"), varsObject),
          ]),
        ])
      );
    };

    // Track all declared variables across the entire traversal
    const declaredVariables = new Set<string>();

    // Helper to collect variable names from a declaration
    const collectDeclaredVars = (statement: t.Statement) => {
      if (t.isVariableDeclaration(statement)) {
        statement.declarations.forEach((decl) => {
          if (t.isIdentifier(decl.id)) {
            declaredVariables.add(decl.id.name);
          }
        });
      }
      // Also handle for loop variable declarations
      if (t.isForStatement(statement) && statement.init) {
        if (t.isVariableDeclaration(statement.init)) {
          statement.init.declarations.forEach((decl) => {
            if (t.isIdentifier(decl.id)) {
              declaredVariables.add(decl.id.name);
            }
          });
        }
      }
    };

    // Helper to instrument a block of statements
    const instrumentBlock = (statements: t.Statement[]): t.Statement[] => {
      const instrumented: t.Statement[] = [];

      statements.forEach((statement) => {
        const line = statement.loc?.start.line || 0;

        // Handle nested block structures - DON'T trace after control flow statements
        if (t.isForStatement(statement)) {
          // Add for loop variable to declared variables FIRST
          if (statement.init && t.isVariableDeclaration(statement.init)) {
            statement.init.declarations.forEach((decl) => {
              if (t.isIdentifier(decl.id)) {
                declaredVariables.add(decl.id.name);
              }
            });
          }
          // Instrument the loop body
          if (statement.body && t.isBlockStatement(statement.body)) {
            statement.body.body = instrumentBlock(statement.body.body);
          }
          // Add the for statement (no trace after control flow)
          instrumented.push(statement);
        } else if (
          t.isWhileStatement(statement) ||
          t.isDoWhileStatement(statement)
        ) {
          if (statement.body && t.isBlockStatement(statement.body)) {
            statement.body.body = instrumentBlock(statement.body.body);
          }
          // Add loop statement (no trace after control flow)
          instrumented.push(statement);
        } else if (t.isIfStatement(statement)) {
          if (
            statement.consequent &&
            t.isBlockStatement(statement.consequent)
          ) {
            statement.consequent.body = instrumentBlock(
              statement.consequent.body
            );
          }
          if (statement.alternate && t.isBlockStatement(statement.alternate)) {
            statement.alternate.body = instrumentBlock(
              statement.alternate.body
            );
          }
          // Add if statement (no trace after control flow)
          instrumented.push(statement);
        } else {
          // Regular statements: collect vars, add statement, then trace
          collectDeclaredVars(statement);

          // Add the original statement
          instrumented.push(statement);

          // Add trace after non-return/throw statements
          const isReturnOrThrow =
            t.isReturnStatement(statement) || t.isThrowStatement(statement);

          if (!isReturnOrThrow) {
            // Only capture variables that have been declared
            const varsToCapture = Array.from(declaredVariables);
            instrumented.push(createTraceCall(line, varsToCapture));
          }
        }
      });

      return instrumented;
    };

    traverseFn(ast, {
      FunctionDeclaration(path: any) {
        // Reset declared variables for each function
        declaredVariables.clear();

        // Get function parameters and add them to declared variables
        const paramNames: string[] = [];
        path.node.params.forEach((param: any) => {
          if (t.isIdentifier(param)) {
            paramNames.push(param.name);
            declaredVariables.add(param.name);
          }
        });

        // Add initial trace at function entry with just parameters
        const firstLine = path.node.loc?.start.line || 1;
        const initialTrace = createTraceCall(firstLine, paramNames);

        path.node.body.body = [
          initialTrace,
          ...instrumentBlock(path.node.body.body),
        ];
      },

      // Note: Nested structures (for/while/if) are now handled in instrumentBlock
      // to ensure proper variable tracking order
    });

    const output = generateFn(ast, {
      retainLines: false,
      compact: false,
    });

    return output.code;
  } catch (error) {
    console.error("Error instrumenting code:", error);
    throw new Error(`Failed to instrument code: ${error}`);
  }
}

/**
 * Generate test call for function with parameters
 */
export function generateFunctionCall(
  functionName: string,
  params: Record<string, unknown>
): string {
  const args = Object.values(params)
    .map((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();

        // Check if it's a JavaScript literal (array, object, number, boolean, null, undefined)
        // Arrays: [1,2,3]
        // Objects: {a:1, b:2}
        // Numbers: 123, 123.45, -123
        // Booleans: true, false
        // Special: null, undefined

        // Try to detect arrays and objects
        if (
          (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}"))
        ) {
          // Return as-is, it's an array or object literal
          return trimmed;
        }

        // Check for numbers (including negative and decimals)
        if (/^-?\d+\.?\d*$/.test(trimmed)) {
          return trimmed;
        }

        // Check for booleans
        if (trimmed === "true" || trimmed === "false") {
          return trimmed;
        }

        // Check for null or undefined
        if (trimmed === "null" || trimmed === "undefined") {
          return trimmed;
        }

        // Otherwise, treat as a string
        return `"${value}"`;
      }
      return String(value);
    })
    .join(", ");

  return `${functionName}(${args})`;
}
