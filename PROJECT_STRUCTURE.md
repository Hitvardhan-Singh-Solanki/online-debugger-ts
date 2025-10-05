# Project Structure

```
online-debugger/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD workflow
├── .vscode/
│   └── extensions.json             # Recommended VS Code extensions
├── public/
│   └── vite.svg                    # Favicon
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx          # Monaco Editor integration with themes
│   │   ├── DebuggerUI.tsx          # Control buttons, theme toggle, output
│   │   ├── ParameterInputs.tsx     # Dynamic function parameter inputs
│   │   └── TraceVisualizer.tsx     # Variable state visualization
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/
│   │   ├── instrumentCode.ts       # Babel AST instrumentation logic
│   │   └── worker.ts               # Web Worker for sandboxed execution
│   ├── App.tsx                     # Main application component
│   ├── index.css                   # Global styles and Tailwind imports
│   ├── main.tsx                    # React entry point
│   └── vite-env.d.ts               # Vite type declarations
├── .gitignore                      # Git ignore rules
├── .nvmrc                          # Node version specification
├── DEPLOYMENT.md                   # Detailed deployment guide
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── PROJECT_STRUCTURE.md            # This file
├── QUICK_START.md                  # Quick start guide
├── README.md                       # Main documentation
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

## 📂 Directory Descriptions

### `.github/workflows/`
Contains GitHub Actions workflows for CI/CD automation.
- `deploy.yml` - Automatically builds and deploys to GitHub Pages on push to main

### `.vscode/`
VS Code workspace configuration.
- `extensions.json` - Recommended extensions for development

### `public/`
Static assets served directly by Vite.
- `vite.svg` - App favicon

### `src/components/`
React components for the UI.
- **CodeEditor.tsx** - Wraps Monaco Editor with Night Owl theme and line highlighting
- **DebuggerUI.tsx** - Control panel with run/step buttons, theme toggle, and output display
- **ParameterInputs.tsx** - Dynamically generates input fields based on function parameters
- **TraceVisualizer.tsx** - Displays variable states at current execution step with animations

### `src/types/`
TypeScript type definitions.
- **index.ts** - Shared types used across the application

### `src/utils/`
Utility functions and workers.
- **instrumentCode.ts** - Uses Babel to parse AST and inject trace calls
- **worker.ts** - Web Worker that executes instrumented code in isolation

### Root Configuration Files

| File | Purpose |
|------|---------|
| `.gitignore` | Specifies files Git should ignore |
| `.nvmrc` | Node version (20.18.0) |
| `eslint.config.js` | ESLint rules and configuration |
| `index.html` | HTML entry point for Vite |
| `package.json` | Dependencies, scripts, metadata |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `tailwind.config.ts` | Tailwind theme and Night Owl colors |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite build settings and plugins |

### Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Comprehensive project documentation |
| `QUICK_START.md` | Get up and running in 5 minutes |
| `DEPLOYMENT.md` | Deployment guide for various platforms |
| `PROJECT_STRUCTURE.md` | This file - project organization |

## 🔄 Data Flow

```
User Input
    ↓
┌─────────────────────────────────────────┐
│  App.tsx (State Management)            │
│  - code state                           │
│  - parameter values                     │
│  - execution snapshots                  │
└─────────────────────────────────────────┘
    ↓                                      ↓
┌─────────────────────┐        ┌───────────────────────┐
│  CodeEditor.tsx     │        │  ParameterInputs.tsx  │
│  - Monaco Editor    │        │  - Dynamic inputs     │
│  - Syntax highlight │        │  - Value parsing      │
└─────────────────────┘        └───────────────────────┘
                                           ↓
                               ┌───────────────────────┐
                               │  instrumentCode.ts    │
                               │  - Parse AST          │
                               │  - Inject traces      │
                               └───────────────────────┘
                                           ↓
                               ┌───────────────────────┐
                               │  worker.ts            │
                               │  - Execute code       │
                               │  - Collect snapshots  │
                               └───────────────────────┘
                                           ↓
┌─────────────────────────────────────────────────────┐
│  DebuggerUI.tsx           TraceVisualizer.tsx      │
│  - Step controls          - Variable display        │
│  - Output display         - Animated transitions    │
└─────────────────────────────────────────────────────┘
```

## 🎨 Styling Architecture

### Tailwind Configuration
- **Dark Theme**: Night Owl inspired colors
- **Light Theme**: Clean, minimal palette
- **Custom animations**: Slide-in, fade-in, pulse-soft

### Theme Colors

```typescript
// Night Owl (Dark)
nightOwl: {
  bg: '#011627',           // Main background
  text: '#d6deeb',         // Primary text
  accent: '#c792ea',       // Accent color (purple)
  blue: '#82aaff',         // Functions
  cyan: '#7fdbca',         // Variables
  green: '#addb67',        // Values
  // ... more colors
}

// Light Mode
light: {
  bg: '#fafafa',           // Main background
  text: '#403f53',         // Primary text
  accent: '#7e57c2',       // Accent color (purple)
  // ... more colors
}
```

## 🔧 Build Process

1. **Development** (`npm run dev`)
   - Vite dev server with HMR
   - Monaco Editor loads from CDN
   - Web Worker runs in module mode

2. **Production** (`npm run build`)
   - TypeScript compilation
   - Vite bundles and optimizes
   - Code splitting for large dependencies
   - Minification and tree shaking

3. **Deployment** (GitHub Actions)
   - Triggered on push to main
   - Runs linting
   - Builds project
   - Deploys to gh-pages branch

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `typescript` | Type safety |
| `vite` | Build tool |
| `tailwindcss` | Styling |
| `@monaco-editor/react` | Code editor |
| `framer-motion` | Animations |
| `@babel/parser` | Parse JavaScript AST |
| `@babel/traverse` | Walk AST nodes |
| `@babel/generator` | Generate code from AST |

## 🧪 Testing Strategy (Future)

Recommended test structure:
```
src/
├── components/
│   ├── __tests__/
│   │   ├── CodeEditor.test.tsx
│   │   ├── DebuggerUI.test.tsx
│   │   └── TraceVisualizer.test.tsx
└── utils/
    └── __tests__/
        ├── instrumentCode.test.ts
        └── worker.test.ts
```

## 📝 Code Style

- **Components**: PascalCase (e.g., `CodeEditor.tsx`)
- **Utilities**: camelCase (e.g., `instrumentCode.ts`)
- **Types**: PascalCase (e.g., `TraceSnapshot`)
- **Props interfaces**: Component name + `Props` (e.g., `CodeEditorProps`)

## 🎯 Core Features Map

| Feature | Implementation | Files |
|---------|---------------|-------|
| Code Editing | Monaco Editor | `CodeEditor.tsx` |
| AST Parsing | Babel | `instrumentCode.ts` |
| Sandboxed Execution | Web Workers | `worker.ts` |
| Stepping | React State | `App.tsx`, `DebuggerUI.tsx` |
| Variable Display | Framer Motion | `TraceVisualizer.tsx` |
| Theming | Tailwind + React State | `tailwind.config.ts`, `App.tsx` |
| Auto-Deploy | GitHub Actions | `.github/workflows/deploy.yml` |

---

**Last Updated**: October 2025

