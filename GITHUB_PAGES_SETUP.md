# GitHub Pages Setup Instructions

## 🚀 How to Enable GitHub Pages for This Project

The GitHub Pages deployment workflow is already configured, but you need to enable it in your repository settings.

### Step-by-Step Instructions

#### **Step 1: Go to Repository Settings**
1. Visit: https://github.com/dilip-poojari/IBM-EMAIL
2. Click on the **"Settings"** tab (top right)
3. Scroll down to find **"Pages"** in the left sidebar
4. Click on **"Pages"**

#### **Step 2: Configure GitHub Pages**
1. Under **"Build and deployment"** section:
   - **Source:** Select **"GitHub Actions"** from the dropdown
   - (Don't select "Deploy from a branch")
2. The page will automatically save your selection

#### **Step 3: Wait for Deployment**
1. Go to the **"Actions"** tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait 1-2 minutes for it to complete
4. Once complete, you'll see a green checkmark ✅

#### **Step 4: Access Your Live Site**
Your site will be available at:
```
https://dilip-poojari.github.io/IBM-EMAIL/
```

### Alternative: Manual Deployment Check

If the workflow doesn't run automatically:

1. Go to **Actions** tab
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button
4. Select **"main"** branch
5. Click **"Run workflow"**

### Troubleshooting

#### **404 Error**
If you get a 404 error:
- Wait 2-3 minutes after enabling Pages
- Clear your browser cache
- Try incognito/private mode
- Check Actions tab for deployment status

#### **Workflow Not Running**
If the workflow doesn't appear:
1. Check that `.github/workflows/deploy.yml` exists
2. Ensure you've pushed all files to GitHub
3. Verify GitHub Actions is enabled:
   - Settings → Actions → General
   - Allow all actions and reusable workflows

#### **Deployment Failed**
If deployment fails:
1. Check the Actions tab for error messages
2. Ensure all files are committed
3. Verify no syntax errors in HTML/CSS/JS
4. Re-run the workflow

### Verification Steps

Once deployed, verify the site works:
1. ✅ Homepage loads correctly
2. ✅ Sidebar navigation works
3. ✅ All pages are accessible
4. ✅ CSS styling is applied
5. ✅ JavaScript interactions work
6. ✅ Icons display properly

### Local Testing Before Deployment

Test locally first:
```bash
# Option 1: Python
python -m http.server 8000
# Visit: http://localhost:8000

# Option 2: Node.js
npx http-server
# Visit: http://localhost:8080

# Option 3: PHP
php -S localhost:8000
# Visit: http://localhost:8000
```

### Custom Domain (Optional)

To use a custom domain:
1. Go to Settings → Pages
2. Under "Custom domain", enter your domain
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www (or @)
   Value: dilip-poojari.github.io
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Enable "Enforce HTTPS" once DNS is configured

### Updating the Site

After making changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

The site will automatically redeploy within 1-2 minutes.

### Current Status

- ✅ Repository created
- ✅ Files committed
- ✅ Workflow configured
- ⏳ **Waiting for GitHub Pages to be enabled**
- ⏳ **Waiting for first deployment**

### Next Steps

1. **Enable GitHub Pages** using instructions above
2. **Wait for deployment** (1-2 minutes)
3. **Visit the live site** at the URL above
4. **Share the link** with others

### Support

If you encounter issues:
- Check GitHub Status: https://www.githubstatus.com/
- GitHub Pages Documentation: https://docs.github.com/pages
- Open an issue in the repository

---

**Note:** GitHub Pages is free for public repositories and includes:
- Free hosting
- HTTPS support
- Custom domain support
- Automatic deployments
- CDN distribution

**Last Updated:** March 18, 2026