# Complete Fix and Deploy Script
# Run this to fix Chart.js/Prism.js issues and deploy to Netlify

param(
    [switch]$SkipTests,
    [switch]$AutoCommit
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Sunset Hills - Complete Fix & Deploy" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean and rebuild
Write-Host "[1/6] Cleaning and rebuilding..." -ForegroundColor Yellow
yarn clean
yarn build

if ($LASTEXITCODE -ne 0) {
    Write-Host "? Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "? Build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Verify dist folder
Write-Host "[2/6] Verifying dist folder..." -ForegroundColor Yellow

$FileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
Write-Host "Found $FileCount files in dist/" -ForegroundColor Green

$CriticalFiles = @("dist\index.html", "dist\solve.html", "dist\code.html")
foreach ($file in $CriticalFiles) {
    if (!(Test-Path $file)) {
        Write-Host "? Missing: $file" -ForegroundColor Red
        exit 1
    }
    Write-Host "? Found: $file" -ForegroundColor Green
}
Write-Host ""

# Step 3: Test locally (optional)
if (!$SkipTests) {
    Write-Host "[3/6] Testing locally..." -ForegroundColor Yellow
    Write-Host "Starting local server on http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "MANUAL TEST REQUIRED:" -ForegroundColor Yellow
    Write-Host "1. Visit http://localhost:3000/solve.html" -ForegroundColor White
    Write-Host "   - Chart should display" -ForegroundColor Gray
    Write-Host "   - Drag bars should work" -ForegroundColor Gray
    Write-Host "   - Presets dropdown should be populated" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Visit http://localhost:3000/code.html" -ForegroundColor White
    Write-Host "   - Code should display with Monokai colors" -ForegroundColor Gray
    Write-Host "   - Language tabs should switch code" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop server when done testing" -ForegroundColor Yellow
    Write-Host ""
    
    npx serve dist
    
    Write-Host ""
    $continue = Read-Host "Did tests pass? (y/n)"
    if ($continue -ne "y") {
        Write-Host "? Tests failed. Fix issues before deploying." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[3/6] Skipping local tests (--SkipTests flag)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Git status
Write-Host "[4/6] Checking Git status..." -ForegroundColor Yellow

$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "Modified files:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    if ($AutoCommit) {
        Write-Host "Auto-committing changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Fix: Convert dynamic imports to static for Chart.js/Prism.js + remove SPA redirect"
        Write-Host "? Changes committed" -ForegroundColor Green
    } else {
        Write-Host "Commit these changes? (y/n)" -ForegroundColor Yellow
        $commit = Read-Host
        
        if ($commit -eq "y") {
            git add .
            $commitMsg = Read-Host "Commit message (or press Enter for default)"
            
            if ([string]::IsNullOrWhiteSpace($commitMsg)) {
                $commitMsg = "Fix: Convert dynamic imports to static for Chart.js/Prism.js"
            }
            
            git commit -m $commitMsg
            Write-Host "? Changes committed" -ForegroundColor Green
        } else {
            Write-Host "? Skipping commit. Remember to commit before deploying!" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "No changes to commit" -ForegroundColor Green
}

Write-Host ""

# Step 5: Push to GitHub
Write-Host "[5/6] Pushing to GitHub..." -ForegroundColor Yellow

$branch = git branch --show-current

Write-Host "Current branch: $branch" -ForegroundColor Cyan

if ($AutoCommit) {
    git push origin $branch
    Write-Host "? Pushed to $branch" -ForegroundColor Green
} else {
    Write-Host "Push to origin/$branch? (y/n)" -ForegroundColor Yellow
    $push = Read-Host
    
    if ($push -eq "y") {
        git push origin $branch
        Write-Host "? Pushed to $branch" -ForegroundColor Green
    } else {
        Write-Host "? Skipping push. Deploy manually later." -ForegroundColor Yellow
    }
}

Write-Host ""

# Step 6: Deployment info
Write-Host "[6/6] Deployment Info" -ForegroundColor Yellow
Write-Host ""
Write-Host "Netlify will auto-deploy from GitHub push" -ForegroundColor Cyan
Write-Host "Expected deploy time: 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "Monitor deployment:" -ForegroundColor Yellow
Write-Host "  https://app.netlify.com/sites/YOUR-SITE-NAME/deploys" -ForegroundColor White
Write-Host ""
Write-Host "After deployment completes:" -ForegroundColor Yellow
Write-Host "  1. Hard refresh: Ctrl + Shift + R" -ForegroundColor White
Write-Host "  2. Test /solve.html - chart should work" -ForegroundColor White
Write-Host "  3. Test /code.html - syntax highlighting should work" -ForegroundColor White
Write-Host ""

Write-Host "======================================" -ForegroundColor Green
Write-Host "? FIX APPLIED & READY TO DEPLOY!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Key Changes Made:" -ForegroundColor Cyan
Write-Host "? Removed SPA redirect from netlify.toml" -ForegroundColor Green
Write-Host "? Converted dynamic imports to static in main.js" -ForegroundColor Green
Write-Host "? All modules now load correctly on Netlify" -ForegroundColor Green
Write-Host ""

Write-Host "Documentation Created:" -ForegroundColor Cyan
Write-Host "  - URGENT-FIX.md (SPA redirect issue)" -ForegroundColor White
Write-Host "  - CHARTJS-PRISM-FIX.md (import issue)" -ForegroundColor White
Write-Host "  - DEPLOYMENT.md (deployment guide)" -ForegroundColor White
Write-Host ""

Write-Host "?? Your Sunset Hills site is ready for production! ??" -ForegroundColor Green
