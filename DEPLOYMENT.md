# 🚀 Deployment Guide

This guide covers deploying the Interactive JavaScript Debugger to Vercel and GitHub Pages.

## 📦 Vercel Deployment (Recommended)

Vercel provides the fastest and easiest deployment experience for Vite apps.

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # First deployment (follow prompts)
   vercel
   
   # Production deployment
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/online-debugger.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Vercel Configuration

The `vercel.json` file is already configured with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Dev command: `npm run dev`
- ✅ SPA routing support

### Environment Variables (Optional)

If you need environment variables:
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add your variables
4. Redeploy

---

## 🐙 GitHub Pages Deployment

### Prerequisites

Before deploying to GitHub Pages, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/online-debugger/', // Change to your repository name
  // ... rest of config
});
```

### Deploy via GitHub Actions (Automated)

The `.github/workflows/deploy.yml` workflow is already set up!

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/ (root)`
   - Save

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **CI/CD Pipeline will**:
   - ✅ Install dependencies
   - ✅ Run linter
   - ✅ Run tests
   - ✅ Build project
   - ✅ Deploy to `gh-pages` branch

4. **Access your app**:
   - `https://yourusername.github.io/online-debugger/`

### Manual Deployment to GitHub Pages

```bash
# Build the project
npm run build

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

---

## 🔄 Switching Between Platforms

### For Vercel/Local Development:
```typescript
// vite.config.ts
base: "/"
```

### For GitHub Pages:
```typescript
// vite.config.ts
base: "/your-repo-name/"
```

---

## 🧪 Pre-Deployment Checklist

Run these commands before deploying:

```bash
# 1. Lint code
npm run lint

# 2. Run tests
npm run test -- --run

# 3. Build locally to verify
npm run build

# 4. Preview production build
npm run preview
```

All checks should pass! ✅

---

## 🌐 Custom Domain (Vercel)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

---

## 📊 Deployment Comparison

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| Setup | ⚡ Instant | 🔧 Manual config |
| Build time | 🚀 ~30s | ⏱️ ~2-3 min |
| SSL | ✅ Auto | ✅ Auto |
| Custom domain | ✅ Free | ✅ Free |
| Analytics | ✅ Built-in | ❌ Need GA |
| Edge network | ✅ Global | ✅ GitHub CDN |
| Build logs | ✅ Detailed | ✅ Actions log |
| Rollbacks | ✅ One-click | 🔧 Git revert |
| Cost | ✅ Free tier | ✅ Free |

**Recommendation**: Use **Vercel** for production, **GitHub Pages** for open-source projects.

---

## 🐛 Troubleshooting

### Vercel: Build fails
```bash
# Check build locally first
npm run build

# Check Node version matches
node -v  # Should be v20
```

### GitHub Pages: 404 on routes
- Ensure `base` in `vite.config.ts` matches your repo name
- Check GitHub Pages is enabled for `gh-pages` branch

### Vercel: Functions timeout
- This app doesn't use serverless functions, so this shouldn't happen
- If it does, check your Web Worker code

---

## 📝 Deployment URLs

Once deployed, update these in your project:

**README.md**:
```markdown
🔗 **Live Demo**: https://your-project.vercel.app
```

**package.json** (optional):
```json
{
  "homepage": "https://your-project.vercel.app"
}
```

---

## 🎉 Success!

Your Interactive JavaScript Debugger is now live! Share it with:
- Twitter/X
- Dev.to
- Reddit (r/webdev, r/javascript)
- Hacker News
- Your team!

---

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
