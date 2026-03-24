# ⚡ GitHub Pages Quick Deployment

**5-Minute Setup:**

## Step 1: Verify Configuration ✅
Already done:
- ✅ `next.config.js` - Static export enabled
- ✅ `package.json` - Deployment scripts added
- ✅ `.github/workflows/deploy-gh-pages.yml` - GitHub Actions workflow created
- ✅ `scripts/deploy-gh-pages.sh` - Deployment scripts ready
- ✅ `scripts/deploy-gh-pages.js` - Deployment scripts ready

## Step 2: Test Locally (2 minutes)

```bash
cd portfolio/frontend

# Install & build
npm install --legacy-peer-deps
npm run build

# Verify
ls -la out/  # Should show index.html and _next/ folder
```

## Step 3: Configure GitHub Pages (1 minute)

1. Go to: `https://github.com/LgrappaG/Workflows-Agents/settings/pages`
2. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Click "Save"

## Step 4: Deploy (1 minute)

```bash
cd portfolio

# Windows
npm run deploy-gh-windows

# Linux/Mac
bash scripts/deploy-gh-pages.sh
```

Or just commit and push - GitHub Actions deploys automatically!

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## Step 5: Wait & Verify (1 minute)

1. Go to: `https://github.com/LgrappaG/Workflows-Agents/actions`
2. Wait for workflow to complete (✅ green checkmark)
3. Visit: `https://lgrapag.github.io/Workflows-Agents/`

**Done! 🎉**

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 errors | Verify `basePath: '/Workflows-Agents'` in next.config.js |
| Styles missing | Hard refresh (Ctrl+Shift+R) or clear cache |
| Workflow fails | Check Actions logs, run `npm install --legacy-peer-deps` |
| Out directory not created | Check that `output: 'export'` is in next.config.js |

**Documentation:** See `GITHUB_PAGES_SETUP.md` for full guide
