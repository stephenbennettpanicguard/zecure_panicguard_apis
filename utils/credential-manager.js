#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const ENV_FILE = path.resolve(__dirname, '..', '.env');

function updateEnvFile(updates) {
  let envContent = fs.readFileSync(ENV_FILE, 'utf8');
  const timestamp = new Date().toISOString();

  // Update each key-value pair
  Object.entries(updates).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;

    if (regex.test(envContent)) {
      // Replace existing line
      envContent = envContent.replace(regex, newLine);
    } else {
      // Add new line
      envContent += `\n${newLine}`;
    }
  });

  // Add update tracking
  const updateTracking = `\n# Credential Management\nCREDENTIALS_UPDATED_DATE=${timestamp}\nCREDENTIALS_UPDATED_BY=${process.env.USER || 'system'}\n`;
  envContent += updateTracking;

  fs.writeFileSync(ENV_FILE, envContent);
  console.log(`✅ Updated ${Object.keys(updates).length} environment variables`);
  console.log(`📅 Last updated: ${timestamp}`);
}

function updateCredentials(username, password, pin) {
  console.log('🔐 Updating test credentials...');

  const updates = {
    'TEST_USERNAME': username,
    'TEST_PASSWORD': password,
    'TEST_PIN': pin
  };

  updateEnvFile(updates);
  console.log('✅ Test credentials updated successfully');
}

function updateBearerToken(token, expiresAt = null) {
  console.log('🔑 Updating bearer token...');

  const timestamp = new Date().toISOString();
  const updates = {
    'AUTH_TOKEN_CURRENT': token,
    'BEARER_TOKEN_UPDATED_DATE': timestamp
  };

  if (expiresAt) {
    updates['AUTH_TOKEN_EXPIRES_AT'] = expiresAt;
    updates['BEARER_TOKEN_EXPIRES_AT'] = expiresAt;
  }

  updateEnvFile(updates);
  console.log('✅ Bearer token updated successfully');
}

function checkTokenExpiration() {
  const expiresAt = process.env.BEARER_TOKEN_EXPIRES_AT || process.env.AUTH_TOKEN_EXPIRES_AT;

  if (!expiresAt) {
    console.log('⚠️  No token expiration date set');
    return false;
  }

  const expirationDate = new Date(expiresAt);
  const now = new Date();
  const thresholdMinutes = parseInt(process.env.BEARER_TOKEN_REFRESH_THRESHOLD_MINUTES || '30');
  const thresholdDate = new Date(now.getTime() + (thresholdMinutes * 60 * 1000));

  const isExpiring = expirationDate <= thresholdDate;
  const isExpired = expirationDate <= now;

  if (isExpired) {
    console.log('❌ Bearer token has expired');
    return false;
  } else if (isExpiring) {
    console.log(`⚠️  Bearer token expires soon: ${expirationDate.toISOString()}`);
    return true;
  } else {
    console.log(`✅ Bearer token is valid until: ${expirationDate.toISOString()}`);
    return true;
  }
}

function refreshTokenIfNeeded() {
  if (process.env.BEARER_TOKEN_AUTO_REFRESH === 'true') {
    if (!checkTokenExpiration()) {
      console.log('🔄 Auto-refresh is enabled but token is expired');
      console.log('💡 Please update the bearer token manually or disable auto-refresh');
      return false;
    }
  }
  return true;
}

function showCurrentCredentials() {
  console.log('\n🔐 Current Credentials:');
  console.log(`Username: ${process.env.TEST_USERNAME || 'Not set'}`);
  console.log(`Password: ${process.env.TEST_PASSWORD ? '***' + process.env.TEST_PASSWORD.slice(-4) : 'Not set'}`);
  console.log(`PIN: ${process.env.TEST_PIN ? '***' + process.env.TEST_PIN.slice(-2) : 'Not set'}`);

  console.log('\n🔑 Bearer Token Status:');
  console.log(`Current Token: ${process.env.AUTH_TOKEN_CURRENT ? 'Set (length: ' + process.env.AUTH_TOKEN_CURRENT.length + ')' : 'Not set'}`);
  console.log(`Expires At: ${process.env.BEARER_TOKEN_EXPIRES_AT || 'Not set'}`);
  console.log(`Last Updated: ${process.env.BEARER_TOKEN_UPDATED_DATE || 'Never'}`);
  console.log(`Auto Refresh: ${process.env.BEARER_TOKEN_AUTO_REFRESH || 'false'}`);
}

function validateCredentials() {
  const required = ['TEST_USERNAME', 'TEST_PASSWORD', 'TEST_PIN'];
  const missing = [];

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.log(`❌ Missing required credentials: ${missing.join(', ')}`);
    return false;
  }

  console.log('✅ All required credentials are set');
  return true;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'update':
      const username = args[1];
      const password = args[2];
      const pin = args[3];

      if (!username || !password || !pin) {
        console.log('Usage: node scripts/credential-manager.js update <username> <password> <pin>');
        process.exit(1);
      }

      updateCredentials(username, password, pin);
      break;

    case 'token':
      const token = args[1];
      const expiresAt = args[2];

      if (!token) {
        console.log('Usage: node scripts/credential-manager.js token <token> [expires_at]');
        process.exit(1);
      }

      updateBearerToken(token, expiresAt);
      break;

    case 'check':
      showCurrentCredentials();
      validateCredentials();
      checkTokenExpiration();
      break;

    case 'validate':
      if (validateCredentials()) {
        console.log('✅ Credential validation passed');
        process.exit(0);
      } else {
        console.log('❌ Credential validation failed');
        process.exit(1);
      }
      break;

    case 'refresh':
      if (refreshTokenIfNeeded()) {
        console.log('✅ Token refresh check completed');
      } else {
        console.log('❌ Token refresh failed');
        process.exit(1);
      }
      break;

    default:
      console.log('🔐 Credential Manager');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/credential-manager.js update <username> <password> <pin>');
      console.log('  node scripts/credential-manager.js token <token> [expires_at]');
      console.log('  node scripts/credential-manager.js check');
      console.log('  node scripts/credential-manager.js validate');
      console.log('  node scripts/credential-manager.js refresh');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/credential-manager.js update user@example.com mypass123 1234');
      console.log('  node scripts/credential-manager.js token abc123token 2025-10-15T10:00:00Z');
      console.log('  node scripts/credential-manager.js check');
      console.log('');
      showCurrentCredentials();
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateCredentials,
  updateBearerToken,
  checkTokenExpiration,
  validateCredentials,
  showCurrentCredentials
};

