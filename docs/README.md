# PG21 Mobile API Testing Framework

A comprehensive Playwright TypeScript API testing framework for PG21 Mobile API with Allure reporting and CI/CD integration.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [CI/CD](#cicd)
- [Test Coverage](#test-coverage)

## ✨ Features

- ✅ Comprehensive API test coverage (positive, negative, and edge cases)
- ✅ Page Object Model (POM) design pattern
- ✅ TypeScript for type safety
- ✅ Allure reporting with detailed test results
- ✅ GitHub Actions CI/CD with hourly automated runs
- ✅ GitHub Pages deployment for test reports
- ✅ Environment-based configuration
- ✅ Parallel test execution
- ✅ Automatic retries on failure

## 📁 Project Structure

```
zecure_panicguard_APIs/
├── src/
│   ├── pages/              # Page Object Models
│   │   ├── auth.page.ts
│   │   ├── user.page.ts
│   │   ├── event.page.ts
│   │   ├── unauthorized.page.ts
│   │   ├── emergency-contacts.page.ts
│   │   ├── user-places.page.ts
│   │   ├── documents.page.ts
│   │   ├── invite-users.page.ts
│   │   ├── reports.page.ts
│   │   ├── misc.page.ts
│   │   └── base.page.ts
│   ├── types/              # TypeScript type definitions
│   │   └── api.types.ts
│   └── utils/              # Helper functions
│       ├── api-helper.ts
│       └── test-data.ts
├── tests/                  # Test specifications
│   ├── auth/
│   ├── user/
│   ├── event/
│   ├── unauthorized/
│   ├── user-management/
│   └── reports/
├── .github/
│   └── workflows/          # CI/CD workflows
│       └── api-tests.yml
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── README.md
```

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zecure_panicguard_APIs
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Update `.env` file with your credentials:
```env
BASE_URL=https://zecure.panicguard.center
API_BASE_URL=https://zecure.panicguard.center/api
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Base URL of the application | `https://zecure.panicguard.center` |
| `API_BASE_URL` | API base URL | `https://zecure.panicguard.center/api` |
| `TEST_USERNAME` | Test user username | `durban` |
| `TEST_PASSWORD` | Test user password | - |
| `HEADLESS` | Run tests in headless mode | `true` |
| `TIMEOUT` | Default test timeout (ms) | `30000` |
| `RETRIES` | Number of retries on failure | `1` |

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directory
- Parallel execution
- Retries
- Reporters
- Base URL
- Timeout settings

## 🚀 Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in UI mode:
```bash
npm run test:ui
```

### Run tests in headed mode:
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run specific test file:
```bash
npx playwright test tests/auth/auth.spec.ts
```

### Run tests by tag:
```bash
npx playwright test --grep @positive
npx playwright test --grep @negative
npx playwright test --grep @edge
npx playwright test --grep @auth
```

## 📊 Test Reports

### Allure Reports

Generate and view Allure report:
```bash
npm run allure:generate
npm run allure:open
```

Or serve directly:
```bash
npm run allure:serve
```

### Playwright HTML Report

View Playwright's built-in report:
```bash
npm run test:report
```

### Report Features

- Test execution timeline
- Request/Response details
- Screenshots on failure
- Test categorization
- Environment information
- Historical trends

## 🔄 CI/CD

### GitHub Actions Workflow

The project includes a GitHub Actions workflow that:
- Runs tests every hour (cron schedule)
- Runs on push to main branch
- Runs on pull requests
- Generates Allure reports
- Deploys reports to GitHub Pages

### Viewing CI/CD Reports

Test reports are automatically deployed to GitHub Pages:
```
https://<username>.github.io/<repository-name>/
```

### Manual Workflow Trigger

You can manually trigger the workflow from GitHub Actions tab.

## 🧪 Test Coverage

### API Endpoints Covered

#### Authentication
- ✅ Login
- ✅ Logout

#### Unauthorized Endpoints
- ✅ Get App Settings
- ✅ Reset Password
- ✅ Credentials Forgotten
- ✅ Email Taken Check
- ✅ User Registration
- ✅ Mobile Number Verification
- ✅ Coupon Code Validation

#### User Management
- ✅ Get/Update Profile
- ✅ Device Management
- ✅ Subscription Management
- ✅ Account Deletion
- ✅ Password Update
- ✅ Mobile Number Update

#### Events
- ✅ Location Tracking
- ✅ Alert Management
- ✅ Device State
- ✅ Meetings
- ✅ Journeys
- ✅ Check-ins
- ✅ Shared Locations
- ✅ Chat Channels

#### Emergency Contacts
- ✅ Contact Groups CRUD
- ✅ Emergency Contacts CRUD

#### User Places
- ✅ Places CRUD

#### Documents
- ✅ Document Management

#### Reports
- ✅ Report Submission
- ✅ Media Upload

### Test Types

- **Positive Tests**: Verify happy path scenarios
- **Negative Tests**: Verify error handling and validation
- **Edge Cases**: Verify boundary conditions and special scenarios
- **Security Tests**: SQL injection, XSS, etc.

## 🏷️ Test Tags

Tests are tagged for easy filtering:

- `@positive` - Positive test scenarios
- `@negative` - Negative test scenarios
- `@edge` - Edge case scenarios
- `@security` - Security-related tests
- `@auth` - Authentication tests
- `@user-profile` - User profile tests
- `@location` - Location tracking tests
- `@alert` - Alert management tests
- `@meeting` - Meeting tests
- `@journey` - Journey tests
- `@emergency-contacts` - Emergency contact tests
- `@reports` - Report tests

## 🔍 Debugging

### Debug specific test:
```bash
npx playwright test tests/auth/auth.spec.ts --debug
```

### Run with trace:
```bash
npx playwright test --trace on
```

### View trace:
```bash
npx playwright show-trace trace.zip
```

## 📝 Writing New Tests

1. Create a new test file in appropriate directory
2. Import required page objects and utilities
3. Set up authentication if needed
4. Write test cases following the pattern:
   - Positive tests
   - Negative tests
   - Edge cases
5. Add appropriate tags
6. Use descriptive test names

Example:
```typescript
import { test, expect } from "@playwright/test";
import { YourPage } from "../../src/pages/your.page";

test.describe("Your Feature Tests", () => {
  test.describe("Positive Tests", () => {
    test("Should do something @positive @your-tag", async () => {
      // Test implementation
    });
  });
});
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Stephen Bennett

## 🔗 Links

- [Playwright Documentation](https://playwright.dev/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

