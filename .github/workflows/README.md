# CI/CD Pipeline Documentation

This directory contains GitHub Actions workflows for the Ayurvedic E-Commerce platform.

## Workflows Overview

### 1. Mobile CI/CD (`mobile-ci-cd.yml`)

Complete CI/CD pipeline for the React Native/Expo mobile application.

**Triggers:**
- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches
- Release events (tags matching `v*`)
- Manual workflow dispatch

**Jobs:**

#### Lint & Type Check
- Runs ESLint for code quality
- Performs TypeScript type checking
- Uses cached node_modules for faster builds

#### Unit Tests
- Runs Jest test suite with coverage
- Enforces 70% coverage threshold
- Uploads coverage to Codecov
- Comments coverage report on PRs

#### Build Android (Staging)
- Builds Android APK using EAS
- Runs only on `main` branch
- Notifies team on failure

#### Build iOS (Staging)
- Builds iOS IPA using EAS
- Runs on macOS runner
- Runs only on `main` branch
- Notifies team on failure

#### E2E Tests
- Runs Detox end-to-end tests
- Uploads test results and screenshots
- Runs after successful builds

#### Deploy Staging
- Publishes EAS update to staging channel
- Runs after successful builds and tests
- Notifies team on Slack

#### Build Production (Android & iOS)
- Builds production bundles/IPAs
- Runs only on release events
- Uploads artifacts for 90 days

#### Deploy Production
- Submits to Google Play Store
- Submits to Apple App Store
- Publishes EAS update to production
- Creates GitHub release
- Notifies team

**Required Secrets:**
```
EXPO_TOKEN          # Expo authentication token
EAS_TOKEN           # EAS build token
CODECOV_TOKEN       # Codecov upload token (optional)
SLACK_WEBHOOK       # Slack notification webhook
ANDROID_SERVICE_ACCOUNT_JSON    # Google Play service account
APPLE_ID                        # Apple ID for App Store
APPLE_APP_SPECIFIC_PASSWORD    # App-specific password
```

---

### 2. Backend CI/CD (`backend-ci.yml`)

CI/CD pipeline for the NestJS backend API.

**Triggers:**
- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches
- Release events
- Manual workflow dispatch

**Jobs:**

#### Lint & Format Check
- Runs ESLint
- Checks code formatting
- Uses cached dependencies

#### Type Check & Build
- Generates Prisma client
- Builds TypeScript application
- Uploads build artifacts

#### Unit Tests
- Runs Jest tests with PostgreSQL and Redis services
- Enforces 80% coverage threshold
- Uploads coverage to Codecov
- Runs database migrations

#### E2E Tests
- Runs end-to-end API tests
- Seeds test database
- Uploads test results

#### Security Scan
- Runs npm audit
- Scans with Trivy
- Uploads results to GitHub Security

#### Docker Build
- Builds and pushes Docker image
- Uses layer caching
- Tags with version, SHA, and branch

#### Deploy Staging
- Deploys to staging environment
- Runs smoke tests
- Notifies team

#### Deploy Production
- Deploys to production on releases
- Runs production smoke tests
- Notifies team

**Required Secrets:**
```
DOCKER_USERNAME     # Docker Hub username
DOCKER_PASSWORD     # Docker Hub password/token
CODECOV_TOKEN       # Codecov upload token (optional)
SLACK_WEBHOOK       # Slack notification webhook
```

**Services:**
- PostgreSQL 15
- Redis 7

---

### 3. ML Service CI/CD (`ml-service-ci.yml`)

CI/CD pipeline for the Python-based ML service.

**Triggers:**
- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches
- Release events
- Manual workflow dispatch

**Jobs:**

#### Lint & Format Check
- Runs Black for code formatting
- Runs isort for import sorting
- Runs Flake8 for linting
- Runs Pylint for code quality
- Runs mypy for type checking

#### Unit Tests
- Runs pytest with coverage
- Uploads coverage to Codecov
- Generates HTML coverage report

#### Model Validation
- Validates ML model files
- Tests model loading
- Tests inference pipeline

#### Security Scan
- Runs Safety for dependency vulnerabilities
- Runs Bandit for security issues
- Scans with Trivy
- Uploads security reports

#### Docker Build
- Builds and pushes Docker image
- Tests Docker image
- Uses layer caching

#### Performance Tests
- Runs performance benchmarks
- Tests inference latency
- Enforces performance thresholds

#### Deploy Staging
- Deploys to staging environment
- Runs health checks
- Runs smoke tests
- Notifies team

#### Deploy Production
- Deploys on release events
- Tags stable Docker image
- Monitors deployment
- Notifies team

**Required Secrets:**
```
DOCKER_USERNAME     # Docker Hub username
DOCKER_PASSWORD     # Docker Hub password/token
CODECOV_TOKEN       # Codecov upload token (optional)
SLACK_WEBHOOK       # Slack notification webhook
```

---

## Status Badges

Add these badges to your main README.md:

```markdown
## Build Status

[![Mobile CI/CD](https://github.com/YOUR_USERNAME/ayurvedic-ecom/workflows/Mobile%20CI/CD/badge.svg)](https://github.com/YOUR_USERNAME/ayurvedic-ecom/actions/workflows/mobile-ci-cd.yml)
[![Backend CI/CD](https://github.com/YOUR_USERNAME/ayurvedic-ecom/workflows/Backend%20CI/CD/badge.svg)](https://github.com/YOUR_USERNAME/ayurvedic-ecom/actions/workflows/backend-ci.yml)
[![ML Service CI/CD](https://github.com/YOUR_USERNAME/ayurvedic-ecom/workflows/ML%20Service%20CI/CD/badge.svg)](https://github.com/YOUR_USERNAME/ayurvedic-ecom/actions/workflows/ml-service-ci.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/ayurvedic-ecom/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/ayurvedic-ecom)
```

---

## Setup Instructions

### 1. Configure Repository Secrets

Go to **Settings → Secrets and variables → Actions** and add:

#### Required for all workflows:
- `SLACK_WEBHOOK` - Slack webhook URL for notifications

#### Mobile-specific:
- `EXPO_TOKEN` - Get from `npx expo login` then `npx expo whoami --json`
- `EAS_TOKEN` - Get from Expo dashboard
- `ANDROID_SERVICE_ACCOUNT_JSON` - Google Play service account JSON
- `APPLE_ID` - Your Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD` - Generate at appleid.apple.com

#### Backend-specific:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token

#### Optional:
- `CODECOV_TOKEN` - Get from codecov.io after connecting repository

### 2. Configure Environments

Go to **Settings → Environments** and create:
- `staging` - Add protection rules if needed
- `production` - Add required reviewers and branch protection

### 3. EAS Configuration

Ensure your `ayur-mobile/eas.json` has profiles:

```json
{
  "build": {
    "staging": {
      "distribution": "internal",
      "channel": "staging"
    },
    "production": {
      "distribution": "store",
      "channel": "production"
    }
  }
}
```

### 4. Branch Protection

Configure branch protection for `main`:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators

---

## Workflow Features

### Caching Strategy
- **Node modules**: Cached using `actions/cache` with package-lock.json hash
- **Python packages**: Cached using pip cache
- **Docker layers**: Registry-based caching for faster builds
- **Detox builds**: Cached iOS builds for E2E tests

### Parallel Execution
Workflows run jobs in parallel where possible:
- Lint and tests run simultaneously
- Android and iOS builds run in parallel
- Security scans run independently

### Conditional Execution
- Staging builds: Only on `main` branch pushes
- Production builds: Only on release events
- E2E tests: Only after successful builds
- Docker builds: Only on `main` or releases

### Artifact Management
- Coverage reports: 30 days retention
- Build artifacts: 7-90 days retention
- Test results: 7 days retention
- Screenshots: 7 days retention

### Notifications
- Slack notifications on deployment success/failure
- PR comments with coverage reports
- GitHub releases with artifacts

---

## Local Testing

### Test workflows locally with Act:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test mobile workflow
act -W .github/workflows/mobile-ci-cd.yml

# Test specific job
act -j lint-and-typecheck

# Test with secrets
act -s EXPO_TOKEN=xxx -s EAS_TOKEN=xxx
```

---

## Troubleshooting

### Mobile builds failing
1. Check EAS token is valid: `npx eas whoami`
2. Verify app.json configuration
3. Check iOS/Android credentials in Expo dashboard

### Backend tests failing
1. Verify PostgreSQL and Redis services are healthy
2. Check database migrations are up to date
3. Ensure test environment variables are set

### Docker builds failing
1. Verify Dockerfile exists and is valid
2. Check Docker Hub credentials
3. Review build context paths

### Coverage threshold failures
1. Add more unit tests
2. Adjust threshold in workflow env variables
3. Exclude test files from coverage

---

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep secrets secure** - never commit tokens
3. **Update dependencies** regularly
4. **Monitor build times** and optimize caching
5. **Review security scan results** promptly
6. **Test deployment** in staging before production
7. **Document changes** in PR descriptions
8. **Use semantic versioning** for releases

---

## Maintenance

### Regular Tasks
- [ ] Update action versions quarterly
- [ ] Review and update secrets
- [ ] Monitor workflow execution times
- [ ] Clean up old artifacts
- [ ] Update Node.js/Python versions
- [ ] Review security scan results

### Monthly
- [ ] Audit dependency vulnerabilities
- [ ] Review test coverage trends
- [ ] Optimize caching strategies
- [ ] Update documentation

---

## Support

For issues with:
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/actions)
- **EAS Build**: [Expo EAS Documentation](https://docs.expo.dev/build/introduction/)
- **Docker**: [Docker Documentation](https://docs.docker.com/)
- **NestJS**: [NestJS Documentation](https://docs.nestjs.com/)

---

## License

This CI/CD configuration is part of the Ayurvedic E-Commerce Platform.
