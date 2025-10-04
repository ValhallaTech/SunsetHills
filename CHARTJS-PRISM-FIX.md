# Chart.js & Prism.js Not Working - Troubleshooting Guide

## What We Changed

### Problem
Dynamic imports (`import()`) were being used in `main.js`, which can cause issues with Parcel's bundling and module resolution on Netlify.

### Solution
Converted **all dynamic imports to static imports** in `src/js/main.js`.

**Before (Dynamic - Problematic):**
```javascript
Promise.all([
  import('./chartSetup.js'),
  import('./presets.js'),
  import('./toast.js'),
]).then(([chartModule, presetsModule, toastModule]) => {
  // Use modules...
});
```

**After (Static - Fixed):**
```javascript
// Import all modules at the top of the file
import {
  initChart,
  resetBuildings,
  // ... other exports
} from './chartSetup.js';

import { getPreset, getPresetOptionsHTML } from './presets.js';
import { showSuccess, showError, showInfo } from './toast.js';
import { initCodeDisplay, copyCode } from './codeDisplay.js';

// Use directly in page-specific code
if (currentPage === 'solve.html') {
  initChart();
  // ...
}
```

---

## Deploy This Fix

### Step 1: Clean Build

```powershell
cd C:\Repo\SunsetHills
yarn clean
yarn build
```

### Step 2: Verify Local Build Works

```powershell
npx serve dist
```

Then visit:
- `http://localhost:3000/solve.html` - Chart should work!
- `http://localhost:3000/code.html` - Code highlighting should work!

### Step 3: Commit & Push

```powershell
git add src/js/main.js
git commit -m "Fix: Convert dynamic imports to static imports for Netlify compatibility"
git push origin main
```

### Step 4: Wait for Netlify Deploy

Netlify will auto-deploy in ~2-3 minutes.

### Step 5: Clear Browser Cache

**Critical!** After deployment:
- Hard refresh: `Ctrl + Shift + R`
- Or use Incognito mode
- Or clear cache manually

---

## What Should Work Now

### Solve Page (`/solve.html`)

**Chart.js:**
- ? Chart renders immediately on page load
- ? Drag bars up/down to adjust heights
- ? Orange bars = sunset view, Gray = no view
- ? Height labels appear above bars

**Controls:**
- ? Preset dropdown populated with 12 options
- ? Reset button returns to default heights
- ? Randomize button creates random heights
- ? Add/Remove building buttons work
- ? Manual input accepts comma-separated values

**Statistics:**
- ? All 6 stat cards update in real-time
- ? Percentages calculate correctly

**Dark Mode:**
- ? Toggle switches theme
- ? Chart colors update
- ? Theme persists on reload

### Code Page (`/code.html`)

**Prism.js:**
- ? JavaScript code displays with Monokai theme
- ? Python tab shows Python code
- ? Java tab shows Java code
- ? C# tab shows C# code
- ? Syntax highlighting with proper colors:
  - Pink keywords
  - Yellow strings
  - Green function names
  - Tan comments

**Features:**
- ? Language tabs switch code examples
- ? Copy button copies to clipboard
- ? Dark background (#272822) for code blocks

---

## Browser Console Checks

Open DevTools (`F12`) and check the Console tab:

### Expected Output on `solve.html`:

```
Theme initialized: light mode
Sunset Hills initialized on solve.html
Initializing solver page...
Initializing chart...
Chart created successfully with drag functionality enabled
Chart initialized successfully
Populating preset dropdown...
Preset dropdown populated
Reset button wired up
Randomize button wired up
Manual input wired up
Add building button wired up
Remove building button wired up
? Chart and all controls initialized successfully
```

### Expected Output on `code.html`:

```
Theme initialized: light mode
Sunset Hills initialized on code.html
Initializing code display page...
Code display initialized with dynamic code loading
Code display initialized
Copy button wired up
? Code display initialized successfully
```

### ? Should NOT See:

- `? Error initializing chart`
- `? Error initializing code display`
- `Module not found` errors
- `404` errors for JS files
- `Uncaught (in promise)` errors
- `Cannot find module` errors

---

## Network Tab Checks

Switch to Network tab in DevTools:

### Should See (Status 200):
- ? `solve.html` - Status 200
- ? `SunsetHills.[hash].js` - Status 200 (main bundle)
- ? `chartSetup.[hash].js` - Status 200 (chart module)
- ? `presets.[hash].js` - Status 200 (presets module)
- ? `toast.[hash].js` - Status 200 (toast module)
- ? `SunsetHills.[hash].css` - Status 200 (styles)
- ? All Font Awesome fonts - Status 200

### ? Should NOT See:
- `404` for any JS/CSS files
- `ERR_ABORTED` for any assets
- `CORS` errors
- `Failed to load module` errors

---

## If Still Not Working

### 1. Check Netlify Deploy Log

1. Go to https://app.netlify.com
2. Click your site
3. Click "Deploys"
4. Click the latest deploy
5. Check "Deploy log" for errors

Look for:
- ? `Build succeeded`
- ? `Site is live`
- ? `Build failed` or error messages

### 2. Check Netlify Build Settings

Go to Site Settings ? Build & deploy ? Continuous Deployment:

**Should be:**
- Build command: `yarn build`
- Publish directory: `dist`
- Node version: `22.20.0` (from `.nvmrc`)

### 3. Clear Netlify Cache

If you suspect caching issues:

1. Go to Deploys
2. Click "Trigger deploy"
3. Select "Clear cache and deploy site"

### 4. Check Specific Error Messages

**If chart doesn't appear:**
- Check console for: `Chart canvas not found`
- Verify `<canvas id="buildingsChart">` exists in HTML

**If presets don't populate:**
- Check console for: `Preset select element not found`
- Verify `<select id="presetSelect">` exists in HTML

**If code doesn't highlight:**
- Check console for Prism errors
- Verify code examples loaded (shouldn't see `.txt` files in dist/)

**If buttons don't work:**
- Check console for: `[Button] not found!`
- Verify button IDs match: `resetBtn`, `randomizeBtn`, etc.

---

## Module Bundling Explained

**Why Static Imports Work Better:**

1. **Parcel's Tree Shaking:**
   - Static imports allow Parcel to analyze dependencies at build time
   - Creates optimized bundles with only needed code

2. **Module Resolution:**
   - Static imports resolve at build time
   - Dynamic imports resolve at runtime (can fail in production)

3. **Code Splitting:**
   - Parcel automatically splits static imports into optimal chunks
   - Ensures Chart.js loads with `solve.html`, not `index.html`

4. **Production Optimization:**
   - Static imports get minified and optimized together
   - Better compression and smaller bundle sizes

---

## File Sizes After Fix

Your bundles should be approximately:

| File | Size | Purpose |
|------|------|---------|
| `chartSetup.[hash].js` | ~280 KB | Chart.js + drag plugin |
| `SunsetHills.[hash].js` | ~109 KB | Main bundle (index/solve) |
| `SunsetHills.[hash].js` | ~87 KB | Main bundle (code) |
| `codeDisplay.[hash].js` | ~41 KB | Prism.js + code examples |
| `SunsetHills.[hash].css` | ~345 KB | Bootstrap + Font Awesome + custom |

Total page weight:
- **Home:** ~500 KB
- **Solve:** ~900 KB (includes Chart.js)
- **Code:** ~600 KB (includes Prism.js)

---

## Success Criteria

After deploying this fix, you should be able to:

### On Solve Page:
1. ? See the chart immediately on page load
2. ? Drag any bar up or down smoothly
3. ? Select "All Flat" from presets ? all bars same height
4. ? Click Randomize ? bars change to random heights
5. ? Toggle dark mode ? chart colors update smoothly
6. ? Open DevTools ? see success messages, no errors

### On Code Page:
1. ? See JavaScript code with Monokai colors
2. ? Click Python tab ? code switches instantly
3. ? Click Java tab ? code switches instantly
4. ? Click C# tab ? code switches instantly
5. ? Click Copy ? see success toast
6. ? Toggle dark mode ? Monokai stays dark (correct)

---

## Final Checklist

- [ ] Converted dynamic imports to static in `main.js`
- [ ] Built successfully with `yarn build`
- [ ] Tested locally with `npx serve dist`
- [ ] Committed changes to Git
- [ ] Pushed to `main` branch
- [ ] Waited for Netlify deploy (~3 minutes)
- [ ] Hard refreshed browser (`Ctrl + Shift + R`)
- [ ] Tested solve.html ? chart works ?
- [ ] Tested code.html ? syntax highlighting works ?
- [ ] Checked console ? no errors ?
- [ ] Checked Network tab ? all assets load ?

---

**This fix addresses the root cause of module loading failures on Netlify!** ??
