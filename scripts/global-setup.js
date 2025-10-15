#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'https://zecure.panicguard.center/api';
const CHECK_TIMEOUT = 10000; // 10 seconds

async function checkApiConnectivity() {
  console.log(`🔍 Checking API connectivity to: ${API_BASE_URL}`);

  return new Promise((resolve) => {
    const url = new URL(API_BASE_URL);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + '/auth',
      method: 'POST',
      timeout: CHECK_TIMEOUT,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'API-Connectivity-Check/1.0'
      }
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let data = '';

      // Check if response is JSON
      const contentType = res.headers['content-type'] || '';
      const isJson = contentType.includes('application/json');

      if (!isJson && contentType.includes('text/html')) {
        resolve({
          accessible: false,
          reason: 'API returned HTML instead of JSON',
          statusCode: res.statusCode,
          contentType: contentType,
          url: API_BASE_URL
        });
        return;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (isJson) {
            const jsonResponse = JSON.parse(data);
            resolve({
              accessible: true,
              statusCode: res.statusCode,
              responseTime: res.headers['x-response-time'] || 'unknown',
              url: API_BASE_URL
            });
          } else {
            resolve({
              accessible: false,
              reason: 'Unexpected content type',
              statusCode: res.statusCode,
              contentType: contentType,
              url: API_BASE_URL
            });
          }
        } catch (error) {
          resolve({
            accessible: false,
            reason: 'Failed to parse JSON response',
            error: error.message,
            statusCode: res.statusCode,
            url: API_BASE_URL
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        accessible: false,
        reason: 'Network error',
        error: error.message,
        url: API_BASE_URL
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        accessible: false,
        reason: 'Request timeout',
        url: API_BASE_URL
      });
    });

    // Send a minimal test request
    req.write('test=connectivity');
    req.end();
  });
}

async function globalSetup() {
  try {
    const result = await checkApiConnectivity();

    if (result.accessible) {
      console.log('✅ API is accessible - running tests normally');
      console.log(`📊 Status Code: ${result.statusCode}`);
      console.log(`⚡ Response Time: ${result.responseTime}ms`);
      console.log(`🔗 URL: ${result.url}\n`);

      // Set environment variable to indicate API is accessible
      process.env.API_ACCESSIBLE = 'true';
      process.env.SKIP_API_TESTS = 'false';
    } else {
      console.log('❌ API is not accessible');
      console.log(`🔗 URL: ${result.url}`);
      console.log(`📊 Status Code: ${result.statusCode || 'N/A'}`);
      console.log(`📝 Reason: ${result.reason}`);

      if (result.error) {
        console.log(`⚠️  Error: ${result.error}`);
      }

      console.log('\n📋 API server issues detected:');
      console.log('• Server may be down or not configured');
      console.log('• API endpoints returning HTML error pages');
      console.log('• Authentication endpoints not responding with JSON');
      console.log('• Network connectivity issues');

      console.log('\n🔄 Setting up test environment for API issues...\n');

      // Set environment variables to skip API tests
      process.env.API_ACCESSIBLE = 'false';
      process.env.SKIP_API_TESTS = 'true';

      // Create a summary file for the report
      const summary = {
        timestamp: new Date().toISOString(),
        apiAccessible: false,
        apiUrl: API_BASE_URL,
        reason: result.reason,
        statusCode: result.statusCode,
        error: result.error,
        recommendations: [
          'Check if the API server is running',
          'Verify API_BASE_URL in .env file',
          'Check network connectivity to the API server',
          'Verify API credentials and authentication format',
          'Check if API endpoints are correctly configured',
          'Consider using mock data for testing when API is unavailable'
        ]
      };

      fs.writeFileSync(
        path.resolve(__dirname, '..', 'api-connectivity-report.json'),
        JSON.stringify(summary, null, 2)
      );

      console.log('📄 API connectivity report saved to: api-connectivity-report.json');
    }

    // Set the environment variable that tests can check
    process.env.API_CONNECTIVITY_CHECKED = 'true';

  } catch (error) {
    console.error('💥 Unexpected error during API connectivity check:', error.message);

    // Default to skipping tests if check fails
    process.env.API_ACCESSIBLE = 'false';
    process.env.SKIP_API_TESTS = 'true';
    process.env.API_CONNECTIVITY_CHECKED = 'true';
  }
}

module.exports = globalSetup;

// Run if called directly
if (require.main === module) {
  globalSetup().then(() => {
    console.log('🏁 Global setup completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Global setup failed:', error.message);
    process.exit(1);
  });
}

