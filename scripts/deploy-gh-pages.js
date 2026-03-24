#!/usr/bin/env node

/**
 * GitHub Pages Deployment Script
 * Builds Next.js static export and deploys to gh-pages branch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const OUT_DIR = path.join(FRONTEND_DIR, 'out');

console.log('\n🚀 GitHub Pages Deployment Script\n');

try {
  // Check if we're in the correct directory
  if (!fs.existsSync(path.join(FRONTEND_DIR, 'package.json'))) {
    throw new Error('❌ Frontend directory not found. Run this from portfolio root.');
  }

  // Step 1: Clean previous build
  console.log('📦 Cleaning previous build...');
  if (fs.existsSync(OUT_DIR)) {
    execSync(`rm -rf ${OUT_DIR}`, { stdio: 'inherit' });
  }

  // Step 2: Install dependencies
  console.log('\n📥 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
  });

  // Step 3: Type check
  console.log('\n✅ Running TypeScript check...');
  try {
    execSync('npm run type-check', {
      cwd: FRONTEND_DIR,
      stdio: 'inherit',
    });
  } catch (e) {
    console.warn('⚠️  TypeScript warnings found (not blocking)');
  }

  // Step 4: Build Next.js
  console.log('\n🔨 Building Next.js...');
  execSync('npm run build', {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
  });

  // Step 5: Verify static export
  console.log('\n🔍 Verifying static export...');
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error('❌ Static export failed - out directory not found');
  }

  const outSize = getDirectorySize(OUT_DIR);
  const files = countFiles(OUT_DIR);
  console.log(`✅ Static export successful`);
  console.log(`   📁 Files: ${files}`);
  console.log(`   💾 Size: ${formatBytes(outSize)}`);

  // Step 6: List generated files
  console.log('\n📋 Generated files:');
  listFiles(OUT_DIR, 0, 10);

  // Step 7: Create .nojekyll
  const noJekyll = path.join(OUT_DIR, '.nojekyll');
  fs.writeFileSync(noJekyll, '');
  console.log('\n✅ Created .nojekyll file');

  // Step 8: Provide deployment instructions
  console.log('\n📦 Next steps:');
  console.log('   1. Push changes to your repository');
  console.log('   2. GitHub Actions will automatically deploy to gh-pages branch');
  console.log('   3. Website will be available at: https://lgrapag.github.io/Workflows-Agents/\n');

  console.log('✨ Build ready for deployment!\n');
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message, '\n');
  process.exit(1);
}

// Helper functions
function getDirectorySize(dir) {
  let size = 0;

  function walkDir(current) {
    const files = fs.readdirSync(current);
    for (const file of files) {
      const filePath = path.join(current, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        size += stat.size;
      }
    }
  }

  walkDir(dir);
  return size;
}

function countFiles(dir) {
  let count = 0;

  function walkDir(current) {
    const files = fs.readdirSync(current);
    for (const file of files) {
      const filePath = path.join(current, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        count++;
      }
    }
  }

  walkDir(dir);
  return count;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function listFiles(dir, depth = 0, maxDepth = 10, prefix = '') {
  if (depth > maxDepth) return;

  const files = fs.readdirSync(dir).sort();
  for (let i = 0; i < Math.min(files.length, 15); i++) {
    const file = files[i];
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isLast = i === files.length - 1;
    const connector = isLast ? '└── ' : '├── ';

    if (stat.isDirectory()) {
      console.log(`   ${prefix}${connector}📁 ${file}/`);
      if (depth < 2) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        listFiles(filePath, depth + 1, maxDepth, newPrefix);
      }
    } else {
      const size = formatBytes(stat.size);
      console.log(`   ${prefix}${connector}📄 ${file} (${size})`);
    }
  }

  if (files.length > 15) {
    console.log(`   ${prefix}... and ${files.length - 15} more files`);
  }
}
