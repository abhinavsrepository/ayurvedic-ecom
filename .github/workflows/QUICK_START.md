# CI/CD Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Add Required Secrets (2 minutes)

Go to **Settings → Secrets and variables → Actions** and add:

#### Essential Secrets (Add these first)
```bash
EXPO_TOKEN              # Get: npx expo login && npx expo whoami --json
EAS_TOKEN               # Get: From Expo dashboard
DOCKER_USERNAME         # Your Docker Hub username
DOCKER_PASSWORD         # Docker Hub access token
SLACK_WEBHOOK           # Optional: Slack webhook URL
```

### Step 2: Create Environments (1 minute)

Go to **Settings → Environments** and create:
- `staging` (no protection needed)
- `production` (add 1-2 reviewers)

### Step 3: Test Your Pipeline (2 minutes)

```bash
# Create a test branch
git checkout -b test/ci-pipeline

# Make a small change
echo "# Testing CI/CD" >> ayur-mobile/README.md

# Commit and push
git add .
git commit -m "test: Verify CI/CD pipeline"
git push origin test/ci-pipeline

# Create PR on GitHub
# Watch the workflows run! 🎉
```

---

## 📋 Secrets Cheat Sheet

### Get EXPO_TOKEN
```bash
cd ayur-mobile
npx expo login
npx expo whoami --json
# Copy the "sessionSecret" value
```

### Get DOCKER_PASSWORD
1. Login to https://hub.docker.com
2. Account Settings → Security
3. New Access Token
4. Copy token

### Get SLACK_WEBHOOK (Optional)
1. https://api.slack.com/apps
2. Create New App → Incoming Webhooks
3. Activate → Add to Workspace
4. Copy Webhook URL

---

## 🔄 Common Workflows

### Deploy to Staging
```bash
git checkout main
git pull origin main
git merge feature/your-branch
git push origin main
# ✅ Auto-deploys to staging
```

### Deploy to Production
```bash
git checkout main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
# ✅ Auto-deploys to production
```

### Run Tests Locally
```bash
# Mobile
cd ayur-mobile
npm run lint
npm run type-check
npm test

# Backend
cd ayurveda-api
npm run lint
npm test

# ML Service
cd ml-service
black --check .
pytest
```

---

## 🐛 Quick Troubleshooting

### Build Failing?
1. Check the Actions tab for error logs
2. Verify all secrets are set correctly
3. Run tests locally first: `npm test`

### Coverage Below Threshold?
1. Add more unit tests
2. Or adjust in workflow file:
   ```yaml
   env:
     COVERAGE_THRESHOLD: 60  # Lower if needed
   ```

### Docker Build Timeout?
1. Check Dockerfile exists in correct directory
2. Verify Docker Hub credentials
3. Check Docker Hub rate limits

### EAS Build Failing?
1. Verify: `npx eas whoami`
2. Check eas.json configuration
3. Verify credentials in Expo dashboard

---

## 📊 Monitor Your Builds

### View Workflow Runs
https://github.com/YOUR_USERNAME/ayurvedic-ecom/actions

### Add Status Badges to README
```markdown
[![Mobile CI/CD](https://github.com/YOUR_USERNAME/ayurvedic-ecom/workflows/Mobile%20CI/CD/badge.svg)](https://github.com/YOUR_USERNAME/ayurvedic-ecom/actions)
```

---

## ✅ Success Checklist

- [ ] All secrets added to GitHub
- [ ] Environments created (staging + production)
- [ ] Test PR created and passed
- [ ] Coverage reports generated
- [ ] Notifications working (if configured)
- [ ] Status badges added to README

---

## 📚 Full Documentation

For detailed documentation, see:
- [Full CI/CD Setup Guide](../../CI_CD_SETUP.md)
- [Workflow Documentation](.github/workflows/README.md)

---

## 🆘 Need Help?

1. Check workflow logs in Actions tab
2. Review [Common Issues](../../CI_CD_SETUP.md#troubleshooting-guide)
3. Test locally before pushing
4. Verify secrets are correct

---

**You're all set!** Your CI/CD pipeline will now automatically:
- ✅ Run tests on every PR
- ✅ Check code quality
- ✅ Build apps for staging
- ✅ Deploy to production on release
- ✅ Send notifications to your team

Happy shipping! 🚀
