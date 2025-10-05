# 🐛 Interactive JavaScript Debugger Visualizer

A powerful, visual debugging tool for JavaScript code built with React, TypeScript, and Vite. Step through your code execution, inspect variables, and understand how your functions work line by line.

![Interactive JavaScript Debugger](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vitest](https://img.shields.io/badge/Tests-Passing-green)

## ✨ Features

- 🎨 **Monaco Editor** with Night Owl theme
- 🔍 **Step-through Debugging** - Navigate through code execution
- 📊 **Variable Inspection** - View variable values and types at each step
- 🎯 **Dynamic Parameter Inputs** - Automatically generated from function signatures
- 🌓 **Light/Dark Theme Toggle** - Beautiful UI in both modes
- ⚡ **Code Instrumentation** - Babel AST transformation for trace injection
- 🔒 **Sandboxed Execution** - Safe code execution in Web Workers
- 🎬 **Smooth Animations** - Framer Motion powered transitions

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/online-debugger.git
cd online-debugger

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 🧪 Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
src/
├── utils/__tests__/
│   └── instrumentCode.test.ts    # Core instrumentation logic tests
└── components/__tests__/
    ├── TraceVisualizer.test.tsx  # Variable display tests
    └── ParameterInputs.test.tsx  # Parameter input tests
```

### What's Tested

- ✅ **Function signature extraction** - Parsing function names and parameters
- ✅ **Code instrumentation** - AST transformation and trace injection
- ✅ **Function call generation** - Creating executable function calls
- ✅ **Component rendering** - UI components display correctly
- ✅ **User interactions** - Parameter inputs work as expected

## 📝 Usage

1. **Write or edit code** in the Monaco Editor (left panel)
2. **Set parameter values** in the auto-generated input fields
3. **Click "Execute & Debug"** to run your code
4. **Use Previous/Next buttons** to step through execution
5. **Inspect variables** in the right panel at each step

### Example Code

```javascript
function fibonacci(n) {
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
```

## 🛠️ Tech Stack

- **Framework**: React 18.3 with TypeScript 5.7
- **Build Tool**: Vite 6.0
- **Editor**: Monaco Editor (VS Code engine)
- **Styling**: TailwindCSS 3.4
- **Animation**: Framer Motion 11.11
- **Code Transformation**: Babel (@babel/parser, @babel/traverse, @babel/generator)
- **Testing**: Vitest 2.1 + React Testing Library
- **CI/CD**: GitHub Actions → GitHub Pages

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 🚢 Deployment

### Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/online-debugger)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Your app will be live at `https://your-project.vercel.app` in seconds! 🚀

### GitHub Pages Deployment

**Important**: Before deploying to GitHub Pages, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/online-debugger/', // Change to your repo name
  // ... rest of config
});
```

The app automatically deploys to GitHub Pages on push to `main` branch via GitHub Actions.

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🏗️ Project Structure

```
online-debugger/
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx           # Monaco editor integration
│   │   ├── DebuggerUI.tsx           # Controls and result display
│   │   ├── TraceVisualizer.tsx      # Variable state visualization
│   │   ├── ParameterInputs.tsx      # Dynamic parameter inputs
│   │   └── __tests__/               # Component tests
│   ├── utils/
│   │   ├── instrumentCode.ts        # Babel AST instrumentation
│   │   ├── worker.ts                # Web Worker for code execution
│   │   └── __tests__/               # Utility tests
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── test/
│   │   └── setup.ts                 # Test configuration
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles
├── .github/workflows/
│   └── deploy.yml                   # CI/CD pipeline
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── tailwind.config.ts
```

## 🎨 Themes

- **Dark Mode**: Night Owl inspired palette with rich colors
- **Light Mode**: Clean, minimal design with soft grays

Toggle between themes using the switch in the top-right corner.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- **Monaco Editor** - VS Code's editor engine
- **Night Owl Theme** - Beautiful dark theme by Sarah Drasner
- **Babel** - JavaScript compiler and AST tools

---

Built with ❤️ using React, TypeScript, and modern web technologies
