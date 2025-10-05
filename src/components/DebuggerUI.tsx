import { motion } from "framer-motion";
import type { Theme } from "../types";

interface DebuggerUIProps {
  onRunAll: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  result: unknown;
  error: string | null;
  theme: Theme;
}

export function DebuggerUI({
  onRunAll,
  onStepForward,
  onStepBackward,
  onReset,
  canStepForward,
  canStepBackward,
  isRunning,
  currentStep,
  totalSteps,
  result,
  error,
  theme,
}: DebuggerUIProps) {
  return (
    <div className="space-y-3">
      {/* Control Buttons - Single Row */}
      <div className="grid grid-cols-4 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRunAll}
          disabled={isRunning}
          className={`py-2 px-3 rounded-lg font-semibold text-xs transition-colors ${
            theme === "dark"
              ? "bg-nightOwl-accent hover:bg-nightOwl-blue text-white disabled:bg-nightOwl-selection disabled:text-nightOwl-textDim"
              : "bg-light-accent hover:bg-purple-600 text-white disabled:bg-light-border disabled:text-light-textDim"
          }`}
          title="Execute the code and collect execution traces"
        >
          {isRunning ? "⏳ Run" : "▶ Execute"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStepBackward}
          disabled={!canStepBackward || isRunning}
          className={`py-2 px-3 rounded-lg font-medium text-xs transition-colors ${
            theme === "dark"
              ? "bg-nightOwl-bgLight hover:bg-nightOwl-selection text-nightOwl-text disabled:bg-nightOwl-bgDark disabled:text-nightOwl-textDim border border-nightOwl-selection"
              : "bg-light-bgSecondary hover:bg-light-highlight text-light-text disabled:bg-light-bg disabled:text-light-textDim border border-light-border"
          }`}
          title="Go back to previous execution step"
        >
          ◀ Previous
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStepForward}
          disabled={!canStepForward || isRunning}
          className={`py-2 px-3 rounded-lg font-medium text-xs transition-colors ${
            theme === "dark"
              ? "bg-nightOwl-bgLight hover:bg-nightOwl-selection text-nightOwl-text disabled:bg-nightOwl-bgDark disabled:text-nightOwl-textDim border border-nightOwl-selection"
              : "bg-light-bgSecondary hover:bg-light-highlight text-light-text disabled:bg-light-bg disabled:text-light-textDim border border-light-border"
          }`}
          title="Advance to next execution step"
        >
          Next ▶
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className={`py-2 px-3 rounded-lg font-medium text-xs transition-colors ${
            theme === "dark"
              ? "bg-nightOwl-red hover:bg-red-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          title="Reset debugger"
        >
          🔄 Reset
        </motion.button>
      </div>

      {/* Step Counter */}
      {totalSteps > 0 && (
        <div
          className={`p-2 rounded-lg text-center ${
            theme === "dark"
              ? "bg-nightOwl-bgLight text-nightOwl-text"
              : "bg-light-bgSecondary text-light-text border border-light-border"
          }`}
        >
          <div className="text-xs font-medium">
            Step {currentStep} / {totalSteps}
          </div>
        </div>
      )}

      {/* Output Section */}
      {(result !== undefined || error) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg ${
            error
              ? theme === "dark"
                ? "bg-red-900/20 border border-nightOwl-red"
                : "bg-red-50 border border-red-300"
              : theme === "dark"
              ? "bg-nightOwl-bgLight border border-nightOwl-selection"
              : "bg-light-bgSecondary border border-light-border"
          }`}
        >
          <h3
            className={`text-sm font-semibold mb-2 ${
              error
                ? theme === "dark"
                  ? "text-nightOwl-red"
                  : "text-red-600"
                : theme === "dark"
                ? "text-nightOwl-green"
                : "text-green-600"
            }`}
          >
            {error ? "Error" : "Result"}
          </h3>
          <div
            className={`font-mono text-xs break-all ${
              theme === "dark" ? "text-nightOwl-text" : "text-light-text"
            }`}
          >
            {error || formatResult(result)}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatResult(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
