import { motion } from "framer-motion";
import type { Theme } from "../types";

interface ParameterInputsProps {
  params: string[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  theme: Theme;
}

export function ParameterInputs({
  params,
  values,
  onChange,
  theme,
}: ParameterInputsProps) {
  if (params.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={`p-4 rounded-lg mb-4 ${
        theme === "dark"
          ? "bg-nightOwl-bgLight border border-nightOwl-selection"
          : "bg-light-bgSecondary border border-light-border"
      }`}
    >
      <h3
        className={`text-sm font-semibold mb-3 ${
          theme === "dark" ? "text-nightOwl-cyan" : "text-light-accent"
        }`}
      >
        Function Parameters
      </h3>
      <div className="space-y-3">
        {params.map((param) => (
          <div key={param}>
            <label
              htmlFor={`param-${param}`}
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-nightOwl-text" : "text-light-text"
              }`}
            >
              {param}
            </label>
            <input
              id={`param-${param}`}
              type="text"
              value={values[param] || ""}
              onChange={(e) => onChange(param, e.target.value)}
              placeholder={`e.g., 42, "text", [1,2,3], {key:"val"}, true`}
              className={`w-full px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                theme === "dark"
                  ? "bg-nightOwl-bg border border-nightOwl-selection text-nightOwl-text placeholder-nightOwl-textDim focus:border-nightOwl-accent focus:ring-1 focus:ring-nightOwl-accent"
                  : "bg-white border border-light-border text-light-text placeholder-light-textDim focus:border-light-accent focus:ring-1 focus:ring-light-accent"
              } outline-none`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
