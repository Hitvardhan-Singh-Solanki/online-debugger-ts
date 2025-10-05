# Important Configuration Note

## Base Path Configuration

The `base` path in `vite.config.ts` needs to be different for development vs. production:

### For Local Development (Current Setting)
```typescript
base: '/'  // ✅ Keep this for local dev
```

Access at: `http://localhost:5173/`

### For GitHub Pages Deployment
```typescript
base: '/online-debugger/'  // Change to your repo name
```

Access at: `https://yourusername.github.io/online-debugger/`

## How to Deploy to GitHub Pages

1. **Before pushing to GitHub**, change `vite.config.ts`:
   ```typescript
   base: '/your-repo-name/', // Replace with your actual repo name
   ```

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **After deployment completes**, you can change it back to `base: '/'` for local development.

## Alternative: Environment-Based Configuration

You can make the base path conditional based on environment:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/online-debugger/' : '/',
  // ... rest of config
});
```

This way, it automatically uses the correct base path for dev vs. production!

## Babel Module Fix

The Babel packages (`@babel/traverse`, `@babel/generator`) are CommonJS modules. We handle both ESM and CommonJS exports:

```typescript
import * as traverse from "@babel/traverse";
import * as generate from "@babel/generator";

const traverseFn = (traverse as any).default || traverse;
const generateFn = (generate as any).default || generate;
```

This ensures compatibility across different build environments.

