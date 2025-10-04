#!/usr/bin/env bash

# Pre-Deployment Checklist and Script
# Run this before deploying to Netlify

echo "======================================"
echo "Sunset Hills - Pre-Deployment Checks"
echo "======================================"
echo ""

# 1. Clean previous builds
echo "? Cleaning previous builds..."
yarn clean
echo ""

# 2. Fresh install
echo "? Installing dependencies..."
yarn install --frozen-lockfile
echo ""

# 3. Build for production
echo "? Building for production..."
yarn build
echo ""

# 4. Check if dist folder exists and has files
if [ ! -d "dist" ]; then
  echo "? ERROR: dist/ folder not created!"
  exit 1
fi

FILE_COUNT=$(find dist -type f | wc -l)
if [ $FILE_COUNT -lt 10 ]; then
  echo "? ERROR: dist/ folder has too few files ($FILE_COUNT)"
  exit 1
fi

echo "? dist/ folder contains $FILE_COUNT files"
echo ""

# 5. Check for critical files
CRITICAL_FILES=("dist/index.html" "dist/solve.html" "dist/code.html")
for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "? ERROR: Missing critical file: $file"
    exit 1
  else
    echo "? Found: $file"
  fi
done
echo ""

# 6. Verify .txt files are NOT in dist (should be inlined)
TXT_COUNT=$(find dist -name "*.txt" | wc -l)
if [ $TXT_COUNT -gt 0 ]; then
  echo "??  WARNING: Found .txt files in dist/ (should be inlined)"
  find dist -name "*.txt"
else
  echo "? Code examples properly inlined (no .txt files in dist/)"
fi
echo ""

# 7. Check for sourcemaps (optional, but good for debugging)
MAP_COUNT=$(find dist -name "*.map" | wc -l)
echo "? Generated $MAP_COUNT sourcemap files"
echo ""

# 8. Check bundle sizes
echo "?? Bundle Sizes:"
echo "  HTML files:"
find dist -name "*.html" -exec du -h {} \; | sort
echo ""
echo "  JavaScript bundles:"
find dist -name "*.js" ! -name "*.map" -exec du -h {} \; | sort -rh | head -5
echo ""
echo "  CSS bundles:"
find dist -name "*.css" ! -name "*.map" -exec du -h {} \; | sort -rh
echo ""

echo "======================================"
echo "? PRE-DEPLOYMENT CHECKS COMPLETE"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Commit all changes: git add . && git commit -m 'Ready for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Netlify will auto-deploy from main branch"
echo ""
echo "OR deploy manually:"
echo "  netlify deploy --prod --dir=dist"
echo ""
