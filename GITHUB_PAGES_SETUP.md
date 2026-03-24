# 🚀 GitHub Pages Deployment Guide

**Date:** 25-Mar-2026
**Status:** ✅ READY FOR DEPLOYMENT
**URL:** https://lgrapag.github.io/Workflows-Agents/

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Configuration](#configuration)
3. [Local Testing](#local-testing)
4. [Deployment Methods](#deployment-methods)
5. [Troubleshooting](#troubleshooting)
6. [Verification](#verification)

---

## ✅ Prerequisites

Before deploying to GitHub Pages, ensure you have:

- ✅ GitHub account with repository access
- ✅ Node.js 18+ installed
- ✅ Git configured locally
- ✅ Repository: `https://github.com/LgrappaG/Workflows-Agents`
- ✅ Write access to the repository

---

## 🔧 Configuration

### Files Updated for GitHub Pages

#### 1. **next.config.js** ✅
```javascript
// Static export mode enabled
output: 'export',
basePath: '/Workflows-Agents',
trailingSlash: true,
images: { unoptimized: true }
```

#### 2. **package.json** ✅
New deployment scripts added:
```json
"export": "next build && echo 'Static export ready'",
"deploy-gh": "next build && gh-pages -d out -t",
"deploy-gh-windows": "next build && node scripts/deploy-gh-pages.js"
```

#### 3. **deploy-gh-pages.yml** ✅
GitHub Actions workflow for automatic deployment on every push to main branch.

#### 4. **Deployment Scripts** ✅
- `scripts/deploy-gh-pages.sh` - For Linux/Mac
- `scripts/deploy-gh-pages.js` - For Windows/All platforms

---

## 🧪 Local Testing

### Option 1: Quick Test (Recommended)

```bash
cd portfolio/frontend

# Step 1: Install dependencies
npm install --legacy-peer-deps

# Step 2: Run TypeScript check
npm run type-check

# Step 3: Build static export
npm run build

# Step 4: Verify output directory
ls -la out/

# Step 5: Test with local server
npx serve out -p 3000
```

Then visit: `http://localhost:3000/Workflows-Agents/`

### Option 2: Full Automated Test (Windows)

```bash
cd portfolio
npm run deploy-gh-windows
```

### Option 3: Full Automated Test (Linux/Mac)

```bash
cd portfolio
bash scripts/deploy-gh-pages.sh
```

### ✅ What to Check After Build

```
out/
├── index.html          # Home page
├── _next/              # Next.js assets (JS, CSS)
├── public/             # Static files
└── .nojekyll          # Prevents Jekyll processing
```

Key indicators of success:
- ✅ `out/` directory exists with HTML files
- ✅ `_next/static/` contains CSS and JS bundles
- ✅ All paths use `/Workflows-Agents/` prefix
- ✅ `.nojekyll` file is present
- ✅ Bundle size < 500KB (typical)

---

## 🚀 Deployment Methods

### Method 1: Automatic (Recommended) ⭐

**How it works:** Push to main branch → GitHub Actions builds and deploys

#### Setup:
1. Ensure `.github/workflows/deploy-gh-pages.yml` exists ✅
2. Ensure GitHub Pages is configured (see [GitHub Pages Setup](#github-pages-setup))
3. Push to main branch:

```bash
git add .
git commit -m "Enable GitHub Pages deployment"
git push origin main
```

4. Check deployment status: Go to your repository → Actions tab
5. Wait for workflow to complete (~2-3 minutes)
6. Visit: https://lgrapag.github.io/Workflows-Agents/

#### GitHub Actions Workflow Overview:

```
┌─────────────────────────────────────┐
│ Push to main/master                 │
└──────────────────┬──────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Build Job Starts   │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┬──────────┐
        │ • Install deps      │ • 1 min  │
        │ • Type check        │ • 2 min  │
        │ • Build Next.js     │ • 3 min  │
        │ • Upload artifact   │          │
        └──────────┬──────────┴──────────┘
                   │
        ┌──────────▼──────────┐
        │  Deploy Job Starts  │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │ Push to gh-pages br │
        │ Configure Pages     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │ ✅ Live on GitHub   │
        │ Pages after 1-2 min │
        └─────────────────────┘
```

### Method 2: Manual Deployment (Windows)

```bash
# From project root
cd portfolio
npm run deploy-gh-windows

# or install gh-pages globally first
npm install -g gh-pages

# then deploy
cd portfolio/frontend
npm run deploy-gh
```

### Method 3: Manual Deployment (Linux/Mac)

```bash
# From project root
cd portfolio
bash scripts/deploy-gh-pages.sh

# or
cd portfolio/frontend
npm run build
gh-pages -d out -t
```

---

## 🔐 GitHub Pages Setup

### Prerequisites
Ensure your repository is configured for GitHub Pages:

1. **Go to Repository Settings**
   - Navigate to: `https://github.com/LgrappaG/Workflows-Agents/settings/pages`

2. **Configure Source**
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click "Save"

3. **Enable HTTPS** (Recommended)
   - ✅ "Enforce HTTPS" should be enabled

4. **Wait for Pages Status**
   - Go to: Settings → Pages
   - Wait for status to show: "Your site is live at https://lgrapag.github.io/Workflows-Agents/"

---

## 🐛 Troubleshooting

### Issue: "out" directory not created

**Symptoms:** Build fails, `out/` directory doesn't exist

**Solutions:**
1. Check `next.config.js` has `output: 'export'`
2. Verify all pages are static (no API Server Components)
3. Check for dynamic routes without `generateStaticParams()`

```bash
# Verify build
npm run build -- --debug
```

---

### Issue: 404 errors on GitHub Pages

**Symptoms:** Website works locally but 404 on GitHub Pages

**Common Causes:**
- ❌ Missing `basePath: '/Workflows-Agents'` in next.config.js
- ❌ Missing `trailingSlash: true` in next.config.js
- ❌ Broken image imports with Image component

**Fix:**
1. Verify `next.config.js` settings
2. Update imports: `<img>` instead of `<Image>` from Next.js

```javascript
// ❌ This won't work with static export
import Image from 'next/image';
<Image src="/image.jpg" />

// ✅ Use img tag instead
<img src="/image.jpg" alt="description" />
```

---

### Issue: Styles not loading

**Symptoms:** CSS missing, page looks broken

**Common Causes:**
- ❌ CSS imports incorrect paths
- ❌ Tailwind CSS not building

**Fix:**
```bash
# Rebuild Tailwind
npm run build

# Check _next/static/ folder
ls -la frontend/out/_next/static/css/
```

---

### Issue: GitHub Actions Workflow Fails

**Symptoms:** 🔴 in Actions tab

**Debug Steps:**
1. Check error message in Actions logs
2. Common errors:
   - `npm ERR!` → Run `npm install --legacy-peer-deps`
   - Type errors → Run `npm run type-check`
   - Missing secrets → Check workflow file permissions

**Rerun Workflow:**
- Go to Actions → Workflow → "Re-run all jobs" or "Re-run failed jobs"

---

### Issue: Cache/Stale Content

**Symptoms:** Changes not showing after deployment

**Solutions:**
1. **Hard refresh browser:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear GitHub Pages cache:**
   ```bash
   git push origin --delete gh-pages
   npm run deploy-gh-windows  # Recreates gh-pages branch
   ```
3. **Check file timestamps:**
   ```bash
   ls -la frontend/out/index.html
   ```

---

## ✅ Verification Checklist

### Before Deployment

- [ ] `npm run type-check` passes with no errors
- [ ] `npm run build` creates `out/` directory
- [ ] `npx serve out -p 3000` works locally
- [ ] Navigation works with `/Workflows-Agents/` prefix
- [ ] All images load correctly
- [ ] .env.github-pages is configured
- [ ] .github/workflows/deploy-gh-pages.yml exists

### After Automatic Deployment

- [ ] GitHub Actions workflow shows ✅ status
- [ ] Check website at https://lgrapag.github.io/Workflows-Agents/
- [ ] Home page loads without 404 errors
- [ ] Navigation links work
- [ ] Images display correctly
- [ ] Styles load properly
- [ ] Responsive design works on mobile
- [ ] Dark mode toggle works (if implemented)

### Production Checks

```bash
# Check deployed files
curl -I https://lgrapag.github.io/Workflows-Agents/

# Test API connectivity (if using backend)
curl https://lgrapag.github.io/Workflows-Agents/api/health

# Check bundle sizes
npm run build
du -sh frontend/out/
```

---

## 📊 Performance Optimization

### Pre-Deployment

```bash
# Check bundle size
npm run build
du -sh frontend/out/_next/static/

# Analyze Lighthouse
# Visit: https://lgrapag.github.io/Workflows-Agents/
# Then: Chrome DevTools → Lighthouse → Analyze page load
```

### Optimization Recommendations

1. **Image Optimization**
   - ✅ Already using `images: { unoptimized: true }`
   - Use WebP format where possible
   - Compress images before upload

2. **Code Splitting**
   - Next.js 14 handles this automatically
   - Each page gets its own bundle

3. **CSS Optimization**
   - Tailwind CSS already tree-shakes unused styles
   - Monitor bundle size: `_next/static/css/`

4. **Caching Headers**
   - GitHub Pages handles this automatically
   - Assets cached for 365 days by default

---

## 🔄 Continuous Deployment

### Automated Updates

Every push to `main` branch triggers:

1. **Dependency Installation** (1 min)
   - Node modules cached by GitHub Actions

2. **Type Checking** (1-2 min)
   - TypeScript validation

3. **Build Process** (2-3 min)
   - Next.js static export
   - Creates `out/` directory

4. **Deployment** (1 min)
   - Uploads to gh-pages branch
   - GitHub Pages automatically updates

**Total time:** ~5-8 minutes from push to live

### Rollback Process

If deployment has issues:

```bash
# View gh-pages branch history
git log gh-pages --oneline

# Revert to previous version (if needed)
git reset --hard gh-pages@{1}
git push origin gh-pages --force
```

---

## 🎯 Next Steps

### Immediate Actions

1. ✅ Ensure `next.config.js` is correctly configured
2. ✅ Test locally with `npm run build`
3. ✅ Commit all changes: `git add . && git commit -m "Setup GitHub Pages deployment"`
4. ✅ Push to main: `git push origin main`
5. ✅ Watch GitHub Actions workflow complete
6. ✅ Visit website at https://lgrapag.github.io/Workflows-Agents/

### If Using Custom Domain

1. Create CNAME file: `frontend/public/CNAME`
   ```
   yourdomain.com
   ```

2. Update DNS records at your registrar to point to GitHub Pages

3. Enable HTTPS in GitHub Pages settings

### Phase 3.2+ Development

While website is deployed:
1. Continue building components on `main` branch
2. Each push automatically redeploys
3. Test changes locally before pushing
4. Monitor GitHub Actions for build failures

---

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Troubleshooting GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)

---

## 🎉 Success!

When you see the website live at https://lgrapag.github.io/Workflows-Agents/ with:
- ✅ All pages loading
- ✅ Navigation working
- ✅ Styles applied
- ✅ Images visible
- ✅ No console errors

**GitHub Pages deployment is complete!** 🚀

Next phase: Continue building components and pages (Phase 3.2-3.3)

---

**Questions or Issues?**
- Check GitHub Actions logs: https://github.com/LgrappaG/Workflows-Agents/actions
- Review this guide's Troubleshooting section
- Verify workflow file exists: `.github/workflows/deploy-gh-pages.yml`
