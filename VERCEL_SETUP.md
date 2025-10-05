# 🚀 Vercel CI/CD Setup Guide

This guide will help you set up automatic deployments from GitHub to Vercel.

## 📋 Quick Setup (2 Minutes)

### Step 1: Connect GitHub to Vercel (Easiest Method)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your repository**: `Hitvardhan-Singh-Solanki/online-debugger-ts`
4. **Click "Deploy"** (Vercel auto-detects Vite settings)
5. **Done!** 🎉 

Vercel will automatically:
- ✅ Deploy on every push to `main`
- ✅ Create preview deployments for PRs
- ✅ Run your build and tests
- ✅ Provide deployment URLs

**Your app will be live at**: `https://online-debugger-ts.vercel.app` (or similar)

---

## 🔧 Alternative: GitHub Actions CI/CD (Advanced)

If you want more control with GitHub Actions, follow these steps:

### Step 2: Get Vercel Credentials

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project** (run from project root):
   ```bash
   vercel link
   ```
   
   Follow the prompts:
   - Set up and link? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? `online-debugger-ts`
   - Directory? `.` (current directory)

4. **Get your credentials**:
   
   After linking, you'll find these in `.vercel/project.json`:
   ```bash
   cat .vercel/project.json
   ```
   
   You'll see:
   ```json
   {
     "orgId": "your-org-id",
     "projectId": "your-project-id"
   }
   ```

5. **Get your Vercel Token**:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Name: `GitHub Actions`
   - Scope: Full Account
   - Copy the token (you won't see it again!)

### Step 3: Add GitHub Secrets

1. **Go to your GitHub repository**:
   ```
   https://github.com/Hitvardhan-Singh-Solanki/online-debugger-ts/settings/secrets/actions
   ```

2. **Add three secrets** (New repository secret):
   
   | Secret Name | Value |
   |-------------|-------|
   | `VERCEL_TOKEN` | Token from vercel.com/account/tokens |
   | `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### Step 4: Enable GitHub Actions

The workflow file `.github/workflows/vercel-deploy.yml` is already in your repository!

1. **Go to your repository on GitHub**
2. **Click "Actions" tab**
3. **Enable workflows** if prompted
4. The workflow will run automatically on the next push

---

## 🎯 What Happens on Each Push

When you push to GitHub, the CI/CD pipeline will:

1. ✅ **Install dependencies** (`npm ci`)
2. ✅ **Run linter** (`npm run lint`)
3. ✅ **Run tests** (24 tests)
4. ✅ **Build project** (`npm run build`)
5. ✅ **Deploy to Vercel** (production or preview)

**Timeline**: ~2-3 minutes total

---

## 🌐 Deployment URLs

### Production Deployments
- **Main branch** → `https://online-debugger-ts.vercel.app`
- Triggered on push to `main`

### Preview Deployments
- **Pull Requests** → `https://online-debugger-ts-[pr-number].vercel.app`
- Each PR gets its own preview URL
- Perfect for testing before merging!

---

## 📊 Monitor Deployments

### In Vercel Dashboard
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Select your project
- See all deployments, logs, and analytics

### In GitHub
- Go to "Actions" tab in your repository
- See workflow runs and logs
- Green checkmark ✅ = successful deployment

---

## 🔄 Example Workflow

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# GitHub Actions automatically:
# 1. Runs tests ✅
# 2. Builds project ✅
# 3. Deploys to Vercel ✅

# Your changes are live in ~2 minutes!
```

---

## 🐛 Troubleshooting

### Issue: GitHub Action fails with "VERCEL_TOKEN not found"
**Solution**: Make sure you added all three secrets in GitHub repository settings

### Issue: Vercel deployment fails
**Solution**: 
1. Check build logs in Vercel dashboard
2. Ensure `npm run build` works locally
3. Check that `vercel.json` is committed

### Issue: Preview deployments not working
**Solution**: The workflow is set up correctly - ensure the PR is from a branch in the same repo

---

## ✨ Benefits of This Setup

- 🚀 **Automatic deployments** - Push and forget
- 🧪 **Pre-deployment testing** - Catches errors before deploy
- 🔍 **Preview URLs** - Test PRs before merging
- 📊 **Deployment history** - Roll back anytime
- 🌍 **Global CDN** - Fast worldwide access
- 📈 **Analytics** - Built-in performance monitoring

---

## 🎉 You're All Set!

Try it out:

```bash
# Make a small change
echo "console.log('Test deployment');" >> src/main.tsx

# Commit and push
git add .
git commit -m "Test automatic deployment"
git push origin main

# Watch it deploy automatically! 🚀
```

Check:
1. GitHub Actions: `https://github.com/Hitvardhan-Singh-Solanki/online-debugger-ts/actions`
2. Vercel Dashboard: `https://vercel.com/dashboard`
3. Live App: `https://online-debugger-ts.vercel.app`

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

Need help? Open an issue or check the deployment logs!

