import type { TraceSnapshot } from "./instrumentCode";

interface WorkerMessage {
  type: "execute";
  code: string;
  functionCall: string;
}

interface WorkerResponse {
  type: "trace" | "result" | "error";
  data: TraceSnapshot | unknown;
}

const traces: TraceSnapshot[] = [];
let callStack: string[] = [];

// Global trace function that will be called by instrumented code
(self as any).__trace = (snapshot: Omit<TraceSnapshot, "callStack">) => {
  traces.push({
    ...snapshot,
    callStack: [...callStack],
  });
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, code, functionCall } = event.data;

  if (type === "execute") {
    traces.length = 0; // Clear previous traces
    callStack = [];

    try {
      // Execute the instrumented code
      // We need eval here to execute user-provided code in the worker sandbox
      const func = eval(`
        ${code}
        ${functionCall}
      `);

      // Send all traces
      traces.forEach((trace) => {
        self.postMessage({
          type: "trace",
          data: trace,
        } as WorkerResponse);
      });

      // Send final result
      self.postMessage({
        type: "result",
        data: func,
      } as WorkerResponse);
    } catch (error) {
      self.postMessage({
        type: "error",
        data: error instanceof Error ? error.message : "Unknown error",
      } as WorkerResponse);
    }
  }
};

export {};
