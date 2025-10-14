# Setup Guide - PG21 Mobile API Testing Framework

This guide will walk you through setting up the API testing framework and configuring CI/CD with GitHub Actions.

## 📋 Prerequisites

Ensure you have the following installed:
- Node.js v18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)

## 🚀 Local Setup

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd zecure_panicguard_APIs

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### Step 2: Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` file with your credentials:
```env
BASE_URL=https://zecure.panicguard.center
API_BASE_URL=https://zecure.panicguard.center/api
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
TEST_PIN=1111
TEST_MOBILE_NUMBER=+380634534234
```

### Step 3: Verify Setup

Run a test to verify everything is configured correctly:
```bash
npm test tests/auth/auth.spec.ts
```

## 🔧 GitHub Repository Setup

### Step 1: Initialize Git Repository

If not already initialized:
```bash
git init
git add .
git commit -m "Initial commit: API testing framework setup"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/) and create a new repository
2. Name it: `zecure_panicguard_APIs` (or your preferred name)
3. Don't initialize with README (we already have one)

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/zecure_panicguard_APIs.git
git branch -M main
git push -u origin main
```

## 🔐 Configure GitHub Secrets

For CI/CD to work, you need to add secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `TEST_USERNAME` | Test user username | `stephen.bennett+TestAccount@panicguard.com` |
| `TEST_PASSWORD` | Test user password | `password123!` |
| `TEST_PIN` | Test user PIN | `0408` |

### Adding Secrets:

1. Click "New repository secret"
2. Name: `TEST_USERNAME`
3. Secret: `your_username`
4. Click "Add secret"
5. Repeat for `TEST_PASSWORD`

## 📄 Enable GitHub Pages

To view test reports on GitHub Pages:

1. Go to repository **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` (will be created automatically by workflow)
   - **Folder**: `/ (root)`
3. Click **Save**

**Note**: The `gh-pages` branch will be created automatically when the first workflow runs.

## ⚙️ Workflow Configuration

The workflow file is located at `.github/workflows/api-tests.yml`

### Workflow Features:

✅ **Automated Execution**: Runs every hour via cron schedule  
✅ **Manual Trigger**: Can be triggered manually from Actions tab  
✅ **PR Integration**: Runs on pull requests  
✅ **Allure Reports**: Generates detailed test reports  
✅ **GitHub Pages**: Deploys reports automatically

### Schedule (Cron):
```yaml
schedule:
  - cron: '0 * * * *'  # Every hour
```

To change the schedule:
- Every 2 hours: `'0 */2 * * *'`
- Every 6 hours: `'0 */6 * * *'`
- Daily at 9 AM: `'0 9 * * *'`

## 🎯 First Workflow Run

### Automatic Trigger:
Once you push the code, the workflow will automatically run on:
- Push to main branch
- Pull requests
- Every hour (after first run)

### Manual Trigger:
1. Go to **Actions** tab in your repository
2. Select "API Tests with Allure Report" workflow
3. Click "Run workflow" button
4. Select branch (main)
5. Click "Run workflow"

## 📊 Viewing Test Reports

### After Workflow Completes:

1. **GitHub Pages URL** will be available in workflow summary
2. **Format**: `https://YOUR_USERNAME.github.io/zecure_panicguard_APIs/`

### Report Features:

- 🏠 **Main Dashboard**: Beautiful landing page with run information
- 📊 **Allure Report**: Detailed test execution reports
- 📈 **Historical Trends**: Track test results over time
- 🔍 **Test Details**: View request/response data, timings, and more

## 🧪 Running Tests Locally

### Run All Tests:
```bash
npm test
```

### Run Specific Test File:
```bash
npx playwright test tests/auth/auth.spec.ts
```

### Run Tests by Tag:
```bash
# Run all positive tests
npx playwright test --grep @positive

# Run all authentication tests
npx playwright test --grep @auth

# Run negative tests only
npx playwright test --grep @negative
```

### Run with UI Mode:
```bash
npm run test:ui
```

### Debug Mode:
```bash
npm run test:debug
```

## 📊 Generate Allure Reports Locally

### Method 1: Generate and Open
```bash
npm run allure:generate
npm run allure:open
```

### Method 2: Serve Directly
```bash
npm run allure:serve
```

This will:
1. Generate the report
2. Start a local server
3. Open the report in your browser

## 🔍 Troubleshooting

### Issue: Tests failing with authentication errors
**Solution**: Verify credentials in `.env` file are correct

### Issue: Workflow not deploying to GitHub Pages
**Solution**: 
1. Check if `gh-pages` branch exists
2. Verify GitHub Pages is enabled in repository settings
3. Check workflow permissions in Settings → Actions → General

### Issue: Allure report not generating
**Solution**:
1. Ensure `allure-results` directory exists
2. Check if tests actually ran
3. Verify allure-commandline is installed: `npm install`

### Issue: Cron schedule not working
**Solution**:
1. Wait for first manual or push-triggered run to complete
2. Cron only works after first successful workflow execution
3. Verify the workflow file is in `.github/workflows/` directory

## 📝 Best Practices

### 1. Keep Secrets Secure
- Never commit `.env` file
- Never hardcode credentials in tests
- Use GitHub Secrets for CI/CD

### 2. Test Organization
- Follow the existing folder structure
- Group related tests together
- Use descriptive test names

### 3. CI/CD Management
- Monitor workflow runs regularly
- Review failed tests promptly
- Keep dependencies updated

### 4. Reporting
- Check reports after each run
- Investigate failures
- Track trends over time

## 🔄 Updating the Framework

### Pull Latest Changes:
```bash
git pull origin main
npm install
npx playwright install
```

### Update Dependencies:
```bash
npm update
npm audit fix
```

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review GitHub Actions logs
3. Verify all secrets are configured
4. Ensure environment variables are correct

## ✅ Verification Checklist

Before running tests, ensure:

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed
- [ ] `.env` file created and configured
- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] GitHub Secrets configured
- [ ] GitHub Pages enabled
- [ ] Workflow file present in `.github/workflows/`

## 🎉 You're All Set!

Your API testing framework is now configured and ready to use. The tests will run automatically every hour and reports will be available on GitHub Pages.

Visit your GitHub Pages URL to view the test reports:
```
https://YOUR_USERNAME.github.io/zecure_panicguard_APIs/
```

Happy Testing! 🧪✨

