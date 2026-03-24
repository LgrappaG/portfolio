#!/bin/bash

###############################################################################
# GitHub Pages Deployment Script
# Builds Next.js static export and prepares for deployment
###############################################################################

set -e

echo ""
echo "🚀 GitHub Pages Deployment Script"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTFOLIO_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PORTFOLIO_DIR/frontend"
OUT_DIR="$FRONTEND_DIR/out"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if frontend directory exists
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo -e "${RED}❌ Frontend directory not found${NC}"
    exit 1
fi

# Step 1: Clean previous build
echo -e "${BLUE}📦 Cleaning previous build...${NC}"
rm -rf "$OUT_DIR"

# Step 2: Install dependencies
echo ""
echo -e "${BLUE}📥 Installing dependencies...${NC}"
cd "$FRONTEND_DIR"
npm install --legacy-peer-deps

# Step 3: Type check
echo ""
echo -e "${BLUE}✅ Running TypeScript check...${NC}"
npm run type-check || echo -e "${YELLOW}⚠️  TypeScript warnings found (not blocking)${NC}"

# Step 4: Build Next.js
echo ""
echo -e "${BLUE}🔨 Building Next.js...${NC}"
npm run build

# Step 5: Verify static export
echo ""
echo -e "${BLUE}🔍 Verifying static export...${NC}"
if [ ! -d "$OUT_DIR" ]; then
    echo -e "${RED}❌ Static export failed - out directory not found${NC}"
    exit 1
fi

FILE_COUNT=$(find "$OUT_DIR" -type f | wc -l)
DIR_SIZE=$(du -sh "$OUT_DIR" | cut -f1)

echo -e "${GREEN}✅ Static export successful${NC}"
echo "   📁 Files: $FILE_COUNT"
echo "   💾 Size: $DIR_SIZE"

# Step 6: Create .nojekyll
echo ""
echo -e "${BLUE}📝 Creating .nojekyll file...${NC}"
touch "$OUT_DIR/.nojekyll"
echo -e "${GREEN}✅ .nojekyll created${NC}"

# Step 7: List generated files
echo ""
echo -e "${BLUE}📋 Generated files:${NC}"
ls -la "$OUT_DIR" | head -20

if [ $(find "$OUT_DIR" -type f | wc -l) -gt 20 ]; then
    echo "   ... and more files"
fi

# Step 8: Provide deployment instructions
echo ""
echo -e "${GREEN}📦 Next steps:${NC}"
echo "   1. Push changes to your repository"
echo "   2. GitHub Actions will automatically deploy to gh-pages branch"
echo "   3. Website will be available at: https://lgrapag.github.io/Workflows-Agents/"
echo ""
echo -e "${GREEN}✨ Build ready for deployment!${NC}"
echo ""
