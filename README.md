# PG21 Mobile API Testing Framework

A modern, scalable API testing framework built with **Playwright** and **TypeScript** following the **Page Object Model (POM)** design pattern.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Playwright**: Fast, reliable API testing framework
- **Page Object Model**: Clean, maintainable code architecture
- **Custom Fixtures**: Reusable test components and authenticated sessions
- **Environment Variables**: Secure configuration management with dotenv
- **Comprehensive Reporting**: HTML reports, Allure integration
- **Parallel Execution**: Fast test runs with configurable workers
- **CI/CD Ready**: GitHub Actions integration

## 🗂️ Project Structure

```
📦 pg21-mobile-api-tests
├── 📄 package.json                # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 playwright.config.ts        # Playwright configuration
├── 📄 .env                        # Environment variables (create from .env.example)
├── 📄 .env.example                # Environment variables template
├── 📄 README.md                   # This file
│
├── 📁 tests/                      # Test specifications
│   ├── 📁 auth/                   # Authentication tests
│   ├── 📁 event/                  # Event management tests
│   ├── 📁 user/                   # User management tests
│   ├── 📁 user-management/        # User places & emergency contacts
│   ├── 📁 unauthorized/           # Public endpoint tests
│   ├── 📁 reports/                # Reporting tests
│   └── 📄 example.spec.ts         # Example test file showing new structure
│
├── 📁 pages/                      # Page Object Model classes
│   ├── 📄 base.page.ts            # Base page with common methods
│   ├── 📄 auth.page.ts            # Authentication page methods
│   ├── 📄 event.page.ts           # Event management methods
│   ├── 📄 user.page.ts            # User profile methods
│   ├── 📄 reports.page.ts         # Reports methods
│   ├── 📄 unauthorized.page.ts    # Public endpoints methods
│   ├── 📄 emergency-contacts.page.ts  # Emergency contacts methods
│   └── 📄 user-places.page.ts     # User places methods
│
├── 📁 fixtures/                   # Custom test fixtures
│   └── 📄 testFixture.ts          # Test fixtures with page objects
│
├── 📁 utils/                      # Utility functions and helpers
│   ├── 📄 env.ts                  # Environment configuration
│   ├── 📄 helpers.ts              # Test helper functions
│   ├── 📄 api-helper.ts           # API utility functions
│   ├── 📄 test-data.ts            # Test data factory
│   ├── 📄 check-api-connectivity.js  # API connectivity check
│   ├── 📄 credential-manager.js   # Credential management
│   └── 📄 global-setup.js         # Global test setup
│
├── 📁 types/                      # TypeScript type definitions
│   └── 📄 api.types.ts            # API response types
│
├── 📁 docs/                       # Documentation
│   ├── 📄 PROJECT_SUMMARY.md      # Project summary
│   ├── 📄 README.md               # Original README
│   ├── 📄 GITHUB_SETUP_INSTRUCTIONS.md
│   ├── 📄 GITHUB_SECRETS_SETUP.md
│   └── 📄 TRIGGER_WORKFLOW.md
│
├── 📁 reports/                    # Test reports (auto-generated)
├── 📁 screenshots/                # Screenshots for failed tests
├── 📁 allure-results/             # Allure test results
└── 📁 allure-report/              # Allure HTML reports
```

## 🛠️ Setup & Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zecure_panicguard_apis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration
   ```

4. **Install Playwright browsers** (if needed)
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# API Configuration
BASE_URL=https://zecure.panicguard.center
API_BASE_URL=https://zecure.panicguard.center/api

# Test Configuration
TIMEOUT=30000
RETRIES=1
CI=false

# Authentication Credentials
LOGIN_USERNAME=your_username_here
LOGIN_PASSWORD=your_password_here
LOGIN_PIN=your_pin_here

# Test Control
SKIP_API_TESTS=false
API_SKIP_TESTS=false
```

## 🏃‍♂️ Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report

# Skip API tests
npm run test:skip-api

# Run tests in parallel
npm run test:parallel

# Run tests serially
npm run test:serial
```

### Allure Reports

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Serve Allure report
npm run allure:serve
```

### Credential Management

```bash
# Check credentials
npm run credentials:check

# Update credentials
npm run credentials:update

# Validate credentials
npm run credentials:validate

# Update token
npm run token:update

# Refresh token
npm run token:refresh
```

### Maintenance

```bash
# Clean all reports and results
npm run clean

# Clean install (remove node_modules and reinstall)
npm run clean:install
```

## 📝 Writing Tests

### Using the New Fixture System

```typescript
import { test, expect } from "../fixtures/testFixture";
import { TestDataFactory } from "../utils/test-data";

test.describe("My API Tests", () => {
  test("Example test with auth fixture", async ({ authPage }) => {
    const credentials = TestDataFactory.getLoginCredentials();
    const response = await authPage.login(credentials);
    expect(response.status()).toBe(200);
  });

  test("Example with authenticated context", async ({ authenticatedContext }) => {
    const { token, request } = authenticatedContext;
    
    if (token) {
      const response = await request.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(response.ok()).toBeTruthy();
    }
  });
});
```

### Available Fixtures

- **`authPage`**: Authentication operations
- **`eventPage`**: Event and alert management
- **`userPage`**: User profile operations
- **`reportsPage`**: Report submission and retrieval
- **`unauthorizedPage`**: Public endpoints
- **`emergencyContactsPage`**: Emergency contact management
- **`userPlacesPage`**: User places management
- **`authenticatedContext`**: Pre-authenticated session with token

### Page Object Example

```typescript
// pages/example.page.ts
import { BasePage } from "./base.page";
import { APIRequestContext } from "@playwright/test";

export class ExamplePage extends BasePage {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getExample() {
    return this.request.get(`${this.baseURL}/example`);
  }

  async createExample(data: any) {
    return this.request.post(`${this.baseURL}/example`, {
      data: data,
      headers: this.getAuthHeaders(),
    });
  }
}
```

## 🧪 Test Categories

### Test Tags

- **`@positive`**: Happy path scenarios
- **`@negative`**: Error handling scenarios  
- **`@edge`**: Edge cases and boundary conditions
- **`@auth`**: Authentication tests
- **`@alert`**: Alert management tests
- **`@location`**: Location tracking tests
- **`@user-profile`**: User profile tests
- **`@reports`**: Reporting tests

### Running Specific Tests

```bash
# Run tests by tag
npx playwright test --grep "@positive"
npx playwright test --grep "@auth"

# Run specific test file
npx playwright test tests/auth/auth.spec.ts

# Run specific test suite
npx playwright test --grep "Authentication API Tests"
```

## 🔧 Development

### Adding New Tests

1. Create test file in appropriate `tests/` subdirectory
2. Import fixtures: `import { test, expect } from "../fixtures/testFixture";`
3. Use page objects from fixtures
4. Add appropriate test tags
5. Follow existing naming conventions

### Adding New Page Objects

1. Create new page class extending `BasePage`
2. Add methods for API endpoints
3. Export from appropriate location
4. Add to fixtures if needed

### Type Safety

All API responses and request data should use types from `types/api.types.ts`:

```typescript
import { ApiResponse, LoginCredentials } from "../types/api.types";
```

## 📊 Reporting

### HTML Reports
- Generated automatically after test runs
- View with: `npm run test:report`

### Allure Reports  
- Detailed test analytics and trends
- Generate with: `npm run allure:generate`
- View with: `npm run allure:open`

### Screenshots
- Automatically captured for failed tests
- Stored in `screenshots/` directory

## 🚀 CI/CD Integration

The framework is configured for GitHub Actions with:
- Parallel test execution
- Artifact uploads (reports, screenshots)
- Environment-specific configurations
- Slack/email notifications

See `docs/GITHUB_SETUP_INSTRUCTIONS.md` for detailed CI/CD setup.

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add appropriate test tags and documentation
3. Ensure all tests pass locally before submitting
4. Update this README if adding new features

## 📞 Support

For questions or issues:
1. Check existing documentation in `docs/`
2. Review test examples in `tests/example.spec.ts`
3. Contact the development team

---

**Built with ❤️ using Playwright + TypeScript**
