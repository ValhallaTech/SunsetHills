# Netlify Deployment Guide for Sunset Hills

## ?? Quick Deploy

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI globally:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize Netlify site:**
   ```bash
   netlify init
   ```
   
   Follow the prompts:
   - Create & configure a new site
   - Team: Choose your team
   - Site name: `sunset-hills` (or your preferred name)
   - Build command: `yarn build`
   - Publish directory: `dist`

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

### Option 2: Deploy via Netlify Dashboard

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify deployment configuration"
   git push origin main
   ```

2. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com
   - Click "Add new site" ? "Import an existing project"

3. **Connect to GitHub:**
   - Choose "GitHub"
   - Authorize Netlify
   - Select the `SunsetHills` repository

4. **Configure build settings:**
   - **Branch to deploy:** `main`
   - **Build command:** `yarn build`
   - **Publish directory:** `dist`
   - **Node version:** 22.20.0 (auto-detected from .nvmrc)

5. **Click "Deploy site"**

---

## ?? Pre-Deployment Checklist

- [x] `netlify.toml` created with build configuration
- [x] `.nvmrc` file specifying Node.js 22.20.0
- [x] `package.json` has correct build script with `--public-url ./`
- [x] `.gitignore` includes `.netlify/` directory
- [ ] All code committed to GitHub
- [ ] Local build tested: `yarn build`
- [ ] Verified `dist/` folder contains all files

---

## ?? Test Local Build

Before deploying, test the production build locally:

```bash
# Clean previous builds
yarn clean

# Create production build
yarn build

# Serve the dist folder locally (install serve globally if needed)
npx serve dist
```

Visit `http://localhost:3000` to test the built site.

---

## ?? Netlify Configuration Details

### Build Settings (from netlify.toml):
- **Build command:** `yarn build`
- **Publish directory:** `dist`
- **Node.js version:** 22.20.0 LTS

### Features Enabled:
- ? Security headers (X-Frame-Options, CSP, etc.)
- ? Asset caching (1 year for JS/CSS, no cache for HTML)
- ? Gzip/Brotli compression (automatic)
- ? CDN distribution (automatic)

### Environment Variables:
None required for this static site. All configuration is client-side.

---

## ?? Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Site Settings ? Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Netlify provides free HTTPS via Let's Encrypt

---

## ?? Continuous Deployment

Once connected to GitHub, Netlify will automatically:
- ? Deploy on every push to `main` branch
- ? Create preview deployments for pull requests
- ? Run build checks before deploying
- ? Rollback to previous versions if needed

---

## ?? What Gets Deployed

Your production build includes:

**HTML Files:**
- `index.html` - Home page
- `solve.html` - Interactive solver
- `code.html` - Algorithm explanation

**Assets:**
- Bundled JavaScript (minified)
- Bundled CSS (minified)
- Font Awesome icons
- Favicons
- Code examples (inlined)

**Optimizations:**
- Tree-shaking (removes unused code)
- Minification (JS, CSS, HTML)
- Asset hashing (cache busting)
- Parcel optimizations

---

## ?? Troubleshooting

### Build fails with "command not found: yarn"
Netlify should auto-detect Yarn from `yarn.lock`. If not:
- Check that `yarn.lock` is committed to Git
- Add to `netlify.toml`: `[build.environment]` ? `NPM_FLAGS = "--legacy-peer-deps"`

### Assets not loading (404 errors)
- Verify `--public-url ./` is in build command
- Check `dist/` folder structure matches expectations
- Ensure all imports use relative paths

### Node version mismatch
- Verify `.nvmrc` contains `22.20.0`
- Check `netlify.toml` has `NODE_VERSION = "22.20.0"`

### Build succeeds but site doesn't work
- Test local build: `yarn build && npx serve dist`
- Check browser console for errors
- Verify all assets are in `dist/` folder

---

## ?? Post-Deployment Testing

After deployment, test:
- ? All 3 pages load correctly
- ? Dark mode toggle works
- ? Chart drag-and-drop works
- ? Code syntax highlighting displays
- ? Navigation between pages works
- ? Mobile responsiveness
- ? HTTPS is enabled

---

## ?? Success!

Once deployed, your site will be available at:
- **Netlify URL:** `https://your-site-name.netlify.app`
- **Custom domain:** (if configured)

Share your beautiful Sunset Hills visualizer with the world! ???
