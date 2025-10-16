#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test file configurations - defines which fixture each test file should use
const testConfigs = {
  'auth/auth.spec.ts': {
    fixture: 'authPage',
    pageVar: 'authPage',
    removeVars: ['authPage']
  },
  'event/alerts.spec.ts': {
    fixture: 'eventPage',
    pageVar: 'eventPage', 
    removeVars: ['authPage', 'eventPage'],
    useAuth: true
  },
  'event/location-tracking.spec.ts': {
    fixture: 'eventPage',
    pageVar: 'eventPage',
    removeVars: ['authPage', 'eventPage'], 
    useAuth: true
  },
  'event/meetings-journeys.spec.ts': {
    fixture: 'eventPage',
    pageVar: 'eventPage',
    removeVars: ['authPage', 'eventPage'],
    useAuth: true
  },
  'event/shared-location.spec.ts': {
    fixture: 'eventPage', 
    pageVar: 'eventPage',
    removeVars: ['authPage', 'eventPage'],
    useAuth: true
  },
  'reports/reports.spec.ts': {
    fixture: 'reportsPage',
    pageVar: 'reportsPage',
    removeVars: ['reportsPage']
  },
  'unauthorized/app-settings.spec.ts': {
    fixture: 'unauthorizedPage',
    pageVar: 'unauthorizedPage', 
    removeVars: ['unauthorizedPage']
  },
  'unauthorized/password-recovery.spec.ts': {
    fixture: 'unauthorizedPage',
    pageVar: 'unauthorizedPage',
    removeVars: ['unauthorizedPage'] 
  },
  'unauthorized/user-registration.spec.ts': {
    fixture: 'unauthorizedPage',
    pageVar: 'unauthorizedPage',
    removeVars: ['unauthorizedPage']
  },
  'user/user-profile.spec.ts': {
    fixture: 'userPage',
    pageVar: 'userPage',
    removeVars: ['authPage', 'userPage'],
    useAuth: true
  },
  'user-management/emergency-contacts.spec.ts': {
    fixture: 'emergencyContactsPage',
    pageVar: 'emergencyContactsPage',
    removeVars: ['authPage', 'emergencyContactsPage'],
    useAuth: true
  },
  'user-management/user-places.spec.ts': {
    fixture: 'userPlacesPage', 
    pageVar: 'userPlacesPage',
    removeVars: ['authPage', 'userPlacesPage'],
    useAuth: true
  }
};

function fixTestFile(relativePath) {
  const config = testConfigs[relativePath];
  if (!config) {
    console.log(`⚠️  No config found for ${relativePath}`);
    return;
  }

  const filePath = path.join(__dirname, '..', 'tests', relativePath);
  console.log(`🔧 Fixing: ${relativePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove variable declarations for page objects
  for (const varName of config.removeVars) {
    const varRegex = new RegExp(`\\s*let ${varName}:.*?;\\n`, 'g');
    content = content.replace(varRegex, '');
  }
  
  // Remove beforeEach or beforeAll that instantiate page objects and replace with simpler version
  // Handle beforeAll for auth tests
  content = content.replace(
    /test\.beforeAll\(async \(\{ request \}\) => \{[\s\S]*?\}\);/g,
    (match) => {
      if (config.useAuth) {
        return `test.beforeAll(async ({ authenticatedContext }) => {
    authToken = authenticatedContext.token || "";
  });`;
      }
      return '';
    }
  );
  
  // Handle beforeEach  
  content = content.replace(
    /test\.beforeEach\(async \(\{[^}]*\}\) => \{[\s\S]*?\}\);/g,
    (match) => {
      if (match.includes('test.skip')) {
        return `test.beforeEach(async ({}) => {
    // Skip tests if API is not accessible or explicitly skipped
    test.skip(
      process.env.SKIP_API_TESTS === "true" ||
        process.env.API_SKIP_TESTS === "true",
      "API tests are skipped - API server not accessible or tests disabled"
    );
  });`;
      }
      return '';
    }
  );

  // Fix test method signatures to include the fixture
  const fixtureParam = config.useAuth ? `{ ${config.fixture}, authenticatedContext }` : `{ ${config.fixture} }`;
  
  // Update test signatures that don't already have parameters
  content = content.replace(
    /test\("([^"]+)", async \(\) => \{/g,
    `test("$1", async (${fixtureParam}) => {`
  );
  
  // Update test signatures that have empty parameters  
  content = content.replace(
    /test\("([^"]+)", async \(\{\}\) => \{/g,
    `test("$1", async (${fixtureParam}) => {`
  );

  // Add auth token setup for auth tests
  if (config.useAuth) {
    content = content.replace(
      /test\("([^"]+)", async \({ [^}]+ }\) => \{/g,
      (match, testName) => {
        return match + `\n      const { token } = authenticatedContext;
      if (token) ${config.pageVar}.setAuthToken(token);`;
      }
    );
  }

  // Clean up multiple newlines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${relativePath}`);
}

// Process all test files
console.log('🚀 Starting comprehensive test file fixes...\n');

for (const testPath of Object.keys(testConfigs)) {
  try {
    fixTestFile(testPath);
  } catch (error) {
    console.error(`❌ Error fixing ${testPath}:`, error.message);
  }
}

console.log('\n🎉 Test file fixes complete!');
console.log('📝 Note: Some tests may still need manual adjustments for specific patterns.');
