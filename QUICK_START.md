# Quick Start Guide

Get up and running with the Interactive JavaScript Debugger in 5 minutes!

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/online-debugger.git
cd online-debugger

# Install dependencies (make sure you have Node.js 20+ installed)
npm install

# Start the development server
npm run dev
```

Open your browser to `http://localhost:5173` and you're ready to go! 🎉

## 📝 First Steps

### 1. Write Your Function

The editor comes pre-loaded with a simple `add` function:

```javascript
function add(a, b) {
  const sum = a + b;
  return sum;
}
```

Try writing your own function! Examples:

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
```

```javascript
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result = result * i;
  }
  return result;
}
```

### 2. Set Parameter Values

The app automatically detects function parameters and creates input fields. Enter values:
- For numbers: just type `5` or `10`
- For strings: type `"hello"` (the app will parse them correctly)

### 3. Debug Your Code

**Run All**: Click the **▶ Run All** button to execute the entire function and collect all trace data.

**Step Through**: Use the step buttons to move through execution:
- **⏭ Step Forward**: Move to the next execution step
- **⏮ Step Back**: Go back to the previous step

Watch the **Variables** panel on the right to see how values change!

### 4. Switch Themes

Click the sun/moon icon in the controls section to toggle between:
- 🌙 **Dark Mode**: Night Owl theme (great for low-light environments)
- ☀️ **Light Mode**: Clean, minimal theme (perfect for daytime)

## 💡 Pro Tips

1. **Line Highlighting**: The current execution line is highlighted in the editor
2. **Variable Inspection**: Hover over variables in the right panel to see their types
3. **Error Messages**: If your code has errors, they'll appear in the output section
4. **Reset**: Use the 🔄 Reset button to clear all trace data and start fresh

## 🐛 Common Issues

**Issue**: Editor is blank or not loading
**Solution**: Try refreshing the page. Monaco Editor sometimes needs a moment to initialize.

**Issue**: "Worker failed" error
**Solution**: Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)

**Issue**: Variables not showing
**Solution**: Click "Run All" first to execute the code and generate trace data

## 🎓 Learning Resources

- [How AST Works](https://astexplorer.net/)
- [Babel Documentation](https://babeljs.io/docs/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

## 🤝 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Read the source code - it's well-commented!

Happy debugging! 🐛✨

