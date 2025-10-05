import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParameterInputs } from "../ParameterInputs";

describe("ParameterInputs", () => {
  it("should render nothing when no parameters", () => {
    const { container } = render(
      <ParameterInputs
        params={[]}
        values={{}}
        onChange={vi.fn()}
        theme="dark"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render input for each parameter", () => {
    render(
      <ParameterInputs
        params={["a", "b", "c"]}
        values={{}}
        onChange={vi.fn()}
        theme="dark"
      />
    );

    expect(screen.getByLabelText("a")).toBeInTheDocument();
    expect(screen.getByLabelText("b")).toBeInTheDocument();
    expect(screen.getByLabelText("c")).toBeInTheDocument();
  });

  it("should display current values", () => {
    render(
      <ParameterInputs
        params={["x", "y"]}
        values={{ x: "10", y: "20" }}
        onChange={vi.fn()}
        theme="dark"
      />
    );

    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  it("should call onChange when input changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ParameterInputs
        params={["n"]}
        values={{ n: "" }}
        onChange={onChange}
        theme="dark"
      />
    );

    const input = screen.getByLabelText("n");
    await user.type(input, "7");

    // Check that onChange was called with the parameter name
    expect(onChange).toHaveBeenCalledWith("n", "7");
  });

  it("should show Function Parameters heading", () => {
    render(
      <ParameterInputs
        params={["a"]}
        values={{}}
        onChange={vi.fn()}
        theme="dark"
      />
    );

    expect(screen.getByText("Function Parameters")).toBeInTheDocument();
  });
});
