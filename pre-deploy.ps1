# Pre-Deployment Checklist and Script (PowerShell)
# Run this before deploying to Netlify

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Sunset Hills - Pre-Deployment Checks" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
yarn clean
Write-Host ""

# 2. Fresh install
Write-Host "Installing dependencies..." -ForegroundColor Yellow
yarn install --frozen-lockfile
Write-Host ""

# 3. Build for production
Write-Host "Building for production..." -ForegroundColor Yellow
yarn build
Write-Host ""

# 4. Check if dist folder exists and has files
if (!(Test-Path "dist")) {
    Write-Host "ERROR: dist/ folder not created!" -ForegroundColor Red
    exit 1
}

$FileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
if ($FileCount -lt 10) {
    Write-Host "ERROR: dist/ folder has too few files ($FileCount)" -ForegroundColor Red
    exit 1
}

Write-Host "dist/ folder contains $FileCount files" -ForegroundColor Green
Write-Host ""

# 5. Check for critical files
$CriticalFiles = @("dist\index.html", "dist\solve.html", "dist\code.html")
foreach ($file in $CriticalFiles) {
    if (!(Test-Path $file)) {
        Write-Host "ERROR: Missing critical file: $file" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "Found: $file" -ForegroundColor Green
    }
}
Write-Host ""

# 6. Verify .txt files are NOT in dist (should be inlined)
$TxtFiles = Get-ChildItem -Path "dist" -Filter "*.txt" -Recurse
if ($TxtFiles.Count -gt 0) {
    Write-Host "WARNING: Found .txt files in dist/ (should be inlined)" -ForegroundColor Yellow
    $TxtFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
} else {
    Write-Host "Code examples properly inlined (no .txt files in dist/)" -ForegroundColor Green
}
Write-Host ""

# 7. Check for sourcemaps
$MapCount = (Get-ChildItem -Path "dist" -Filter "*.map" -Recurse).Count
Write-Host "Generated $MapCount sourcemap files" -ForegroundColor Green
Write-Host ""

# 8. Check bundle sizes
Write-Host "Bundle Sizes:" -ForegroundColor Cyan
Write-Host "  HTML files:"
Get-ChildItem -Path "dist" -Filter "*.html" | 
    Select-Object Name, @{Name="Size";Expression={"{0:N2} KB" -f ($_.Length / 1KB)}} | 
    Format-Table -AutoSize

Write-Host "  Top 5 JavaScript bundles:"
Get-ChildItem -Path "dist" -Filter "*.js" -Exclude "*.map" | 
    Sort-Object Length -Descending | 
    Select-Object -First 5 Name, @{Name="Size";Expression={"{0:N2} KB" -f ($_.Length / 1KB)}} | 
    Format-Table -AutoSize

Write-Host "  CSS bundles:"
Get-ChildItem -Path "dist" -Filter "*.css" -Exclude "*.map" | 
    Select-Object Name, @{Name="Size";Expression={"{0:N2} KB" -f ($_.Length / 1KB)}} | 
    Format-Table -AutoSize

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "PRE-DEPLOYMENT CHECKS COMPLETE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Commit all changes: git add . && git commit -m 'Ready for deployment'"
Write-Host "2. Push to GitHub: git push origin main"
Write-Host "3. Netlify will auto-deploy from main branch"
Write-Host ""
Write-Host "OR deploy manually:" -ForegroundColor Yellow
Write-Host "  netlify deploy --prod --dir=dist"
Write-Host ""
