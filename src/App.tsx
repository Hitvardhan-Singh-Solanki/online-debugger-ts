import { useState, useEffect, useCallback, useMemo } from "react";
import { CodeEditor } from "./components/CodeEditor";
import { DebuggerUI } from "./components/DebuggerUI";
import { TraceVisualizer } from "./components/TraceVisualizer";
import { ParameterInputs } from "./components/ParameterInputs";
import {
  instrumentCode,
  extractFunctionSignature,
  generateFunctionCall,
} from "./utils/instrumentCode";
import type { TraceSnapshot, Theme } from "./types";
import { motion } from "framer-motion";

const DEFAULT_CODE = `function add(a, b) {
  const sum = a + b;
  return sum;
}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [snapshots, setSnapshots] = useState<TraceSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<unknown>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    a: "5",
    b: "3",
  });

  // Extract function signature from code
  const functionSignature = extractFunctionSignature(code);
  const params = useMemo(
    () => functionSignature?.params || [],
    [functionSignature]
  );

  // Update document theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleRunAll = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setResult(undefined);
    setSnapshots([]);
    setCurrentStepIndex(-1);

    try {
      // Instrument the code
      const instrumented = instrumentCode(code);

      // Generate function call
      const functionName = functionSignature?.name || "anonymous";
      const paramValuesProcessed: Record<string, unknown> = {};

      params.forEach((param) => {
        const value = paramValues[param] || "0";
        // Try to parse as number, otherwise use as string
        paramValuesProcessed[param] = isNaN(Number(value))
          ? value
          : Number(value);
      });

      const functionCall = generateFunctionCall(
        functionName,
        paramValuesProcessed
      );

      // Create worker
      const worker = new Worker(new URL("./utils/worker.ts", import.meta.url), {
        type: "module",
      });

      const collectedSnapshots: TraceSnapshot[] = [];

      worker.onmessage = (event) => {
        const { type, data } = event.data;

        if (type === "trace") {
          collectedSnapshots.push(data as TraceSnapshot);
        } else if (type === "result") {
          setResult(data);
          setSnapshots(collectedSnapshots);
          if (collectedSnapshots.length > 0) {
            setCurrentStepIndex(0);
          }
          setIsRunning(false);
          worker.terminate();
        } else if (type === "error") {
          setError(data as string);
          setIsRunning(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        setError(err.message);
        setIsRunning(false);
        worker.terminate();
      };

      // Send code to worker
      worker.postMessage({
        type: "execute",
        code: instrumented,
        functionCall,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsRunning(false);
    }
  }, [code, functionSignature, params, paramValues]);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < snapshots.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, snapshots.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const handleReset = useCallback(() => {
    setSnapshots([]);
    setCurrentStepIndex(-1);
    setResult(undefined);
    setError(null);
  }, []);

  const handleParamChange = useCallback((name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const currentSnapshot =
    currentStepIndex >= 0 ? snapshots[currentStepIndex] ?? null : null;
  const currentLine = currentSnapshot?.line;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-nightOwl-bg text-nightOwl-text"
          : "bg-light-bg text-light-text"
      }`}
    >
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-nightOwl-accent" : "text-light-accent"
            }`}
          >
            Interactive JavaScript Debugger
          </h1>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-3 rounded-lg ${
              theme === "dark"
                ? "bg-nightOwl-bgLight hover:bg-nightOwl-selection text-nightOwl-text"
                : "bg-light-bgSecondary hover:bg-light-highlight text-light-text border border-light-border"
            } shadow-md transition-colors`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </motion.button>
        </motion.header>

        {/* Main Layout - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Code Editor + Parameters */}
          <div className="space-y-3">
            {/* Code Editor */}
            <div className="h-[calc(100vh-300px)] min-h-[400px]">
              <CodeEditor
                code={code}
                onChange={setCode}
                currentLine={currentLine}
                theme={theme}
              />
            </div>

            {/* Parameters */}
            <ParameterInputs
              params={params}
              values={paramValues}
              onChange={handleParamChange}
              theme={theme}
            />
          </div>

          {/* Right Column - Variables + Controls */}
          <div className="flex flex-col space-y-3 h-[calc(100vh-190px)]">
            {/* Variables Panel */}
            <div
              className={`p-4 rounded-lg flex-1 ${
                theme === "dark"
                  ? "bg-nightOwl-bgLight border border-nightOwl-selection"
                  : "bg-light-bgSecondary border border-light-border"
              } shadow-lg flex flex-col overflow-hidden`}
            >
              <h2
                className={`text-lg font-bold mb-2 ${
                  theme === "dark" ? "text-nightOwl-cyan" : "text-light-accent"
                }`}
              >
                Variables
              </h2>
              <div className="flex-1 overflow-hidden">
                <TraceVisualizer snapshot={currentSnapshot} theme={theme} />
              </div>
            </div>

            {/* Controls Panel */}
            <div
              className={`p-4 rounded-lg ${
                theme === "dark"
                  ? "bg-nightOwl-bgLight border border-nightOwl-selection"
                  : "bg-light-bgSecondary border border-light-border"
              } shadow-lg`}
            >
              <h2
                className={`text-lg font-bold mb-3 ${
                  theme === "dark" ? "text-nightOwl-cyan" : "text-light-accent"
                }`}
              >
                Controls
              </h2>
              <DebuggerUI
                onRunAll={handleRunAll}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                canStepForward={currentStepIndex < snapshots.length - 1}
                canStepBackward={currentStepIndex > 0}
                isRunning={isRunning}
                currentStep={currentStepIndex + 1}
                totalSteps={snapshots.length}
                result={result}
                error={error}
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 text-center text-sm ${
            theme === "dark" ? "text-nightOwl-textDim" : "text-light-textDim"
          }`}
        >
          <p className="mb-2">
            <span className="font-medium">How to use:</span> 1. Write or edit
            the code → 2. Set parameter values → 3. Click "Execute & Debug" → 4.
            Use Previous/Next to step through
          </p>
          <p className="text-xs">
            Built with React, TypeScript, TailwindCSS, Monaco Editor, and Framer
            Motion
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
