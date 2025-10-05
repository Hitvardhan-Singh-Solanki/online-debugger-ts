import { motion, AnimatePresence } from "framer-motion";
import type { TraceSnapshot } from "../types";

interface TraceVisualizerProps {
  snapshot: TraceSnapshot | null;
  theme: "light" | "dark";
}

export function TraceVisualizer({ snapshot, theme }: TraceVisualizerProps) {
  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-full text-nightOwl-textDim dark:text-nightOwl-textDim text-light-textDim px-4">
        <div className="text-center">
          <p className="text-lg mb-2">👈 Click "Execute & Debug"</p>
          <p className="text-sm">to see variable values at each step</p>
        </div>
      </div>
    );
  }

  const entries = Object.entries(snapshot.vars);

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2">
      <div className="mb-3 sticky top-0 bg-nightOwl-bgLight dark:bg-nightOwl-bgLight bg-light-bgSecondary pb-2 z-10">
        <h3 className="text-sm font-semibold text-nightOwl-blue dark:text-nightOwl-blue text-light-accent">
          Line {snapshot.line}
        </h3>
        {snapshot.callStack.length > 0 && (
          <div className="text-xs text-nightOwl-textDim dark:text-nightOwl-textDim text-light-textDim">
            {snapshot.callStack.join(" → ")}
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-nightOwl-textDim dark:text-nightOwl-textDim text-light-textDim text-sm"
          >
            No variables in scope
          </motion.div>
        ) : (
          <div className="space-y-1.5">
            {entries.map(([key, value], index) => (
              <motion.div
                key={`${key}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.02 }}
                className={`p-2 rounded ${
                  theme === "dark"
                    ? "bg-nightOwl-bgLight border border-nightOwl-selection"
                    : "bg-white border border-light-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="font-mono text-xs font-semibold text-nightOwl-cyan dark:text-nightOwl-cyan text-light-accent truncate">
                      {key}
                    </div>
                    <div className="text-xs text-nightOwl-textDim dark:text-nightOwl-textDim text-light-textDim">
                      =
                    </div>
                    <div className="font-mono text-xs flex-1 truncate">
                      <span
                        className={
                          theme === "dark"
                            ? "text-nightOwl-green"
                            : "text-green-600"
                        }
                        title={formatValue(value)}
                      >
                        {formatValue(value)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      theme === "dark"
                        ? "bg-nightOwl-selection text-nightOwl-textDim"
                        : "bg-light-highlight text-light-textDim"
                    }`}
                  >
                    {typeof value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
