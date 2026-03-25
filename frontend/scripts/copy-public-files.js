#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Copy public files from src/public to out directory after build
 * This ensures manifest files and other static assets are included in the static export
 */

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory does not exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied: ${file}`);
    }
  });
}

const publicSrcDir = path.join(__dirname, '../src/public');
const publicOutDir = path.join(__dirname, '../out');

console.log('Copying public files to out directory...');
copyDir(publicSrcDir, publicOutDir);
console.log('Public files copied successfully!');
