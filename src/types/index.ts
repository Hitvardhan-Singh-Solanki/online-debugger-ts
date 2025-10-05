export interface TraceSnapshot {
  line: number;
  vars: Record<string, unknown>;
  callStack: string[];
}

export interface FunctionSignature {
  name: string;
  params: string[];
}

export type Theme = "light" | "dark";
