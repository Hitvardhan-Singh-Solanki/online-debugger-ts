import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TraceVisualizer } from "../TraceVisualizer";
import type { TraceSnapshot } from "../../types";

describe("TraceVisualizer", () => {
  it("should show prompt when no snapshot is provided", () => {
    render(<TraceVisualizer snapshot={null} theme="dark" />);

    expect(screen.getByText(/Click "Execute & Debug"/i)).toBeInTheDocument();
  });

  it("should display line number", () => {
    const snapshot: TraceSnapshot = {
      line: 5,
      vars: { a: 10, b: 20 },
      callStack: [],
    };

    render(<TraceVisualizer snapshot={snapshot} theme="dark" />);

    expect(screen.getByText("Line 5")).toBeInTheDocument();
  });

  it("should display variables", () => {
    const snapshot: TraceSnapshot = {
      line: 3,
      vars: { x: 42, y: "hello" },
      callStack: [],
    };

    render(<TraceVisualizer snapshot={snapshot} theme="dark" />);

    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("y")).toBeInTheDocument();
    expect(screen.getByText('"hello"')).toBeInTheDocument();
  });

  it("should display variable types", () => {
    const snapshot: TraceSnapshot = {
      line: 2,
      vars: { num: 123, str: "test", bool: true },
      callStack: [],
    };

    render(<TraceVisualizer snapshot={snapshot} theme="dark" />);

    expect(screen.getAllByText("number")).toHaveLength(1);
    expect(screen.getAllByText("string")).toHaveLength(1);
    expect(screen.getAllByText("boolean")).toHaveLength(1);
  });

  it("should show message when no variables in scope", () => {
    const snapshot: TraceSnapshot = {
      line: 1,
      vars: {},
      callStack: [],
    };

    render(<TraceVisualizer snapshot={snapshot} theme="dark" />);

    expect(screen.getByText("No variables in scope")).toBeInTheDocument();
  });

  it("should display call stack when present", () => {
    const snapshot: TraceSnapshot = {
      line: 7,
      vars: { result: 42 },
      callStack: ["main", "calculate", "helper"],
    };

    render(<TraceVisualizer snapshot={snapshot} theme="dark" />);

    expect(screen.getByText(/main → calculate → helper/)).toBeInTheDocument();
  });
});
