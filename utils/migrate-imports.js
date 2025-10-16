#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the import replacements
const replacements = [
  // Import statements
  { from: /import { test, expect } from "@playwright\/test";/, to: 'import { test, expect } from "../fixtures/testFixture";' },
  { from: /import { AuthPage } from "\.\.\/\.\.\/src\/pages\/auth\.page";/, to: '' },
  { from: /import { EventPage } from "\.\.\/\.\.\/src\/pages\/event\.page";/, to: '' },
  { from: /import { UserPage } from "\.\.\/\.\.\/src\/pages\/user\.page";/, to: '' },
  { from: /import { ReportsPage } from "\.\.\/\.\.\/src\/pages\/reports\.page";/, to: '' },
  { from: /import { UnauthorizedPage } from "\.\.\/\.\.\/src\/pages\/unauthorized\.page";/, to: '' },
  { from: /import { EmergencyContactsPage } from "\.\.\/\.\.\/src\/pages\/emergency-contacts\.page";/, to: '' },
  { from: /import { UserPlacesPage } from "\.\.\/\.\.\/src\/pages\/user-places\.page";/, to: '' },
  { from: /import { TestDataFactory } from "\.\.\/\.\.\/src\/utils\/test-data";/, to: 'import { TestDataFactory } from "../utils/test-data";' },
  { from: /import { generateRandomEmail } from "\.\.\/\.\.\/src\/utils\/api-helper";/, to: 'import { generateRandomEmail } from "../utils/api-helper";' },
];

// Function to process a file
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Apply replacements
  for (const replacement of replacements) {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      modified = true;
    }
  }

  // Clean up empty lines left by removed imports
  content = content.replace(/\n\n\n+/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⚪ No changes: ${filePath}`);
  }
}

// Function to recursively find TypeScript files
function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsFiles(fullPath, files);
    } else if (item.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const testDir = path.join(__dirname, '..', 'tests');
const testFiles = findTsFiles(testDir);

console.log(`Found ${testFiles.length} test files to process...\n`);

testFiles.forEach(processFile);

console.log('\n🎉 Migration complete!');
console.log('Note: You may need to manually update test method signatures to use fixtures.');
