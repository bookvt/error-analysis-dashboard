# GitHub Pages Deployment Guide

This guide provides step-by-step instructions for deploying the Error Analysis Dashboard to GitHub Pages.

## Prerequisites

Before deploying, ensure:
- You have admin access to the GitHub repository
- The repository is public (or you have GitHub Pro/Enterprise for private repo Pages)
- Node.js 20 or higher is installed locally

## Setup GitHub Pages

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top right)
3. Scroll down to **Pages** in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
   - (Do not select "Deploy from a branch")

### Step 2: Verify Configuration

The repository already includes:
- ✅ `vite.config.js` with correct base path: `/error-analysis-dashboard/`
- ✅ `package.json` with homepage URL
- ✅ GitHub Actions workflow in `.github/workflows/deploy.yml`

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The deployment happens automatically when:
- Code is pushed to the `main` branch
- The GitHub Actions workflow will:
  1. Check out the code
  2. Install dependencies
  3. Build the project
  4. Deploy to GitHub Pages

**To trigger automatic deployment:**
```bash
git push origin main
```

### Method 2: Manual Deployment via GitHub Actions

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow** button
5. Select the branch (usually `main`)
6. Click **Run workflow**

### Method 3: Local Deployment (Alternative)

You can also deploy directly from your local machine:

```bash
# Install dependencies (if not already done)
npm install

# Deploy to gh-pages branch
npm run deploy
```

This will:
1. Build the project (`npm run build`)
2. Deploy the `dist` folder to the `gh-pages` branch

## Verifying Deployment

### Check Deployment Status

1. Go to **Actions** tab in your repository
2. Find the latest **Deploy to GitHub Pages** workflow run
3. Ensure all steps completed successfully (green checkmarks)

### Access Your Site

Once deployed, your site will be available at:
**https://bookvt.github.io/error-analysis-dashboard**

It may take 1-2 minutes for the first deployment to become available.

## Troubleshooting

### Workflow Fails with Permissions Error

**Solution**: Ensure GitHub Pages is set to use **GitHub Actions** as the source (not "Deploy from a branch").

### 404 Error After Deployment

**Possible causes**:
1. GitHub Pages not enabled - Check Settings → Pages
2. Wrong base path in `vite.config.js`
3. Files not uploaded correctly

**Solution**: 
- Verify the workflow completed successfully
- Check that the `base` in `vite.config.js` matches your repository name
- Wait a few minutes and clear browser cache

### Build Fails

**Solution**:
1. Test the build locally: `npm run build`
2. Fix any build errors
3. Commit and push changes

### Assets Not Loading (404 for CSS/JS)

**Cause**: Incorrect base path configuration

**Solution**: 
- Ensure `vite.config.js` has: `base: '/error-analysis-dashboard/'`
- Ensure `package.json` has: `"homepage": "https://bookvt.github.io/error-analysis-dashboard"`

## Workflow Configuration

The deployment workflow (`.github/workflows/deploy.yml`) includes:

### Key Features:
- **Triggers**: Automatic on push to `main`, manual via `workflow_dispatch`
- **Permissions**: Proper permissions for GitHub Pages deployment
- **Concurrency**: Prevents multiple deployments running simultaneously
- **Two Jobs**: 
  - `build`: Compiles the application
  - `deploy`: Publishes to GitHub Pages

### Environment Variables:
- `NODE_VERSION`: 20 (can be updated as needed)
- `BUILD_PATH`: ./dist (output directory)

## Best Practices

1. **Always test locally before pushing**: Run `npm run build` and `npm run preview`
2. **Check Actions tab**: Monitor deployment progress after pushing
3. **Clear cache**: Use Ctrl+F5 or Cmd+Shift+R to see latest changes
4. **Keep dependencies updated**: Regularly update GitHub Actions versions

## CI/CD Pipeline

The complete deployment pipeline:

```
Push to main → GitHub Actions Trigger
    ↓
Install Node.js & Dependencies
    ↓
Build with Vite (npm run build)
    ↓
Upload artifacts to GitHub Pages
    ↓
Deploy to https://bookvt.github.io/error-analysis-dashboard
```

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## Support

For issues or questions:
1. Check the [Actions](https://github.com/bookvt/error-analysis-dashboard/actions) tab for workflow logs
2. Review this deployment guide
3. Open an issue in the repository
