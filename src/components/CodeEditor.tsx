import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { Theme } from "../types";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  currentLine?: number;
  theme: Theme;
}

const nightOwlTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "637777", fontStyle: "italic" },
    { token: "keyword", foreground: "c792ea" },
    { token: "string", foreground: "ecc48d" },
    { token: "number", foreground: "f78c6c" },
    { token: "function", foreground: "82aaff" },
    { token: "variable", foreground: "d6deeb" },
    { token: "type", foreground: "addb67" },
  ],
  colors: {
    "editor.background": "#011627",
    "editor.foreground": "#d6deeb",
    "editor.lineHighlightBackground": "#152B3D",
    "editor.selectionBackground": "#1d3b53",
    "editorCursor.foreground": "#80a4c2",
    "editorWhitespace.foreground": "#2e2040",
    "editorLineNumber.foreground": "#4b6479",
    "editorLineNumber.activeForeground": "#c5e4fd",
  },
};

export function CodeEditor({
  code,
  onChange,
  currentLine,
  theme,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Night Owl theme
    monaco.editor.defineTheme("night-owl", nightOwlTheme);
    monaco.editor.setTheme(theme === "dark" ? "night-owl" : "vs");
  };

  useEffect(() => {
    if (editorRef.current && currentLine !== undefined) {
      // Clear previous decorations
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: {
              startLineNumber: currentLine,
              startColumn: 1,
              endLineNumber: currentLine,
              endColumn: 1,
            },
            options: {
              isWholeLine: true,
              className:
                theme === "dark"
                  ? "bg-nightOwl-lineHighlight"
                  : "bg-light-highlight",
              glyphMarginClassName:
                theme === "dark" ? "bg-nightOwl-accent" : "bg-light-accent",
            },
          },
        ]
      );

      // Scroll to current line
      editorRef.current.revealLineInCenter(currentLine);
    }
  }, [currentLine, theme]);

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(theme === "dark" ? "night-owl" : "vs");
      }
    }
  }, [theme]);

  return (
    <div className="h-full w-full border-2 rounded-lg overflow-hidden border-nightOwl-selection dark:border-nightOwl-selection border-light-border">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme={theme === "dark" ? "night-owl" : "vs"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
