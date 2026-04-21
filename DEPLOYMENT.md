# Netlify Deployment Guide for Sunset Hills

## Infrastructure Snapshot

- Local Node.js version: `24.15.0` (`.nvmrc`)
- Netlify Node.js version: `22.22.2` (`netlify.toml`)
- Yarn version: `4.14.1` (`package.json` `packageManager`, `netlify.toml`)
- Build command: `yarn build`
- Publish directory: `dist`

## Deploy from GitHub (Recommended)

1. Push your branch to GitHub.
2. Open Netlify and import/connect the `ValhallaTech/SunsetHills` repository.
3. Confirm build settings:
   - Build command: `yarn build`
   - Publish directory: `dist`
4. Deploy the site.

Netlify will continue to auto-deploy on new pushes to the configured branch.

## Deploy with Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Pre-Deploy Validation

```bash
yarn install
yarn test
yarn build
```

If linting is required for your branch, run `yarn lint` after confirming ESLint config compatibility with the installed ESLint major version.

## Post-Deploy Checks

- Load `/`, `/solve.html`, and `/code.html`
- Confirm JavaScript and CSS assets load successfully
- Verify the solver interactions and code display page behavior
