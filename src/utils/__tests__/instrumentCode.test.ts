import { describe, it, expect } from "vitest";
import {
  extractFunctionSignature,
  instrumentCode,
  generateFunctionCall,
} from "../instrumentCode";

describe("extractFunctionSignature", () => {
  it("should extract function name and parameters", () => {
    const code = `
      function add(a, b) {
        return a + b;
      }
    `;

    const signature = extractFunctionSignature(code);

    expect(signature).toEqual({
      name: "add",
      params: ["a", "b"],
    });
  });

  it("should handle functions with no parameters", () => {
    const code = `
      function getValue() {
        return 42;
      }
    `;

    const signature = extractFunctionSignature(code);

    expect(signature).toEqual({
      name: "getValue",
      params: [],
    });
  });

  it("should handle rest parameters", () => {
    const code = `
      function sum(...numbers) {
        return numbers.reduce((a, b) => a + b, 0);
      }
    `;

    const signature = extractFunctionSignature(code);

    expect(signature).toEqual({
      name: "sum",
      params: ["...numbers"],
    });
  });

  it("should return null for invalid code", () => {
    const code = "this is not valid javascript";

    const signature = extractFunctionSignature(code);

    expect(signature).toBeNull();
  });

  it("should return null if no function is found", () => {
    const code = "const x = 5;";

    const signature = extractFunctionSignature(code);

    expect(signature).toBeNull();
  });
});

describe("instrumentCode", () => {
  it("should inject trace calls into function", () => {
    const code = `
      function add(a, b) {
        const sum = a + b;
        return sum;
      }
    `;

    const instrumented = instrumentCode(code);

    // Should contain __trace calls
    expect(instrumented).toContain("__trace");
    // Should preserve original function
    expect(instrumented).toContain("function add");
    expect(instrumented).toContain("const sum = a + b");
  });

  it("should handle for loops", () => {
    const code = `
      function fibonacci(n) {
        let a = 0;
        let b = 1;
        for (let i = 2; i <= n; i++) {
          const temp = a + b;
          a = b;
          b = temp;
        }
        return b;
      }
    `;

    const instrumented = instrumentCode(code);

    expect(instrumented).toContain("__trace");
    expect(instrumented).toContain("for");
    expect(instrumented).toContain("const temp = a + b");
  });

  it("should handle if statements", () => {
    const code = `
      function abs(x) {
        if (x < 0) {
          return -x;
        }
        return x;
      }
    `;

    const instrumented = instrumentCode(code);

    expect(instrumented).toContain("__trace");
    expect(instrumented).toContain("if (x < 0)");
  });

  it("should throw error for invalid code", () => {
    const code = "this is not valid javascript";

    expect(() => instrumentCode(code)).toThrow();
  });
});

describe("generateFunctionCall", () => {
  it("should generate function call with number parameters", () => {
    const call = generateFunctionCall("add", { a: 5, b: 3 });

    expect(call).toBe("add(5, 3)");
  });

  it("should generate function call with string parameters", () => {
    const call = generateFunctionCall("greet", { name: "Alice" });

    expect(call).toBe('greet("Alice")');
  });

  it("should generate function call with mixed parameters", () => {
    const call = generateFunctionCall("process", {
      id: 42,
      name: "test",
      active: true,
    });

    expect(call).toBe('process(42, "test", true)');
  });

  it("should handle empty parameters", () => {
    const call = generateFunctionCall("getValue", {});

    expect(call).toBe("getValue()");
  });
});
