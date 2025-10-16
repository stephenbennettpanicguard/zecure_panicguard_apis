#!/bin/bash

# This script fixes the remaining test files to use the fixture system

echo "🔧 Fixing remaining test files..."

# List of test files that need authentication fixtures
AUTH_FILES=(
  "tests/user/user-profile.spec.ts"
  "tests/user-management/emergency-contacts.spec.ts"
  "tests/user-management/user-places.spec.ts"
  "tests/event/alerts.spec.ts"
  "tests/event/location-tracking.spec.ts"
  "tests/event/meetings-journeys.spec.ts"
  "tests/event/shared-location.spec.ts"
)

# Function to fix a single file
fix_file() {
  local file=$1
  echo "🔧 Processing: $file"
  
  # Backup the original
  cp "$file" "$file.bak"
  
  # Create a temp file
  temp_file=$(mktemp)
  
  # Process the file
  {
    # Keep imports
    grep "^import" "$file"
    echo ""
    
    # Add test describe with authenticatedContext
    grep -A 1000 "test\.describe" "$file" | head -1
    
    # Add beforeAll with authenticated context  
    echo "  let authToken: string;"
    echo ""
    echo "  test.beforeAll(async ({ authenticatedContext }) => {"
    echo "    authToken = authenticatedContext.token || \"\";"
    echo "  });"
    echo ""
    
    # Process the rest, updating test signatures
    grep -A 1000 "test\.describe" "$file" | tail -n +2 | \
    sed 's/let authPage: AuthPage;//g' | \
    sed 's/let eventPage: EventPage;//g' | \
    sed 's/let userPage: UserPage;//g' | \
    sed 's/let emergencyContactsPage: EmergencyContactsPage;//g' | \
    sed 's/let userPlacesPage: UserPlacesPage;//g' | \
    sed 's/let authToken: string;//g' | \
    sed '/test\.beforeAll(async/,/});/d' | \
    sed '/test\.beforeEach(async/,/});/d' | \
    sed 's/test("\([^"]*\)", async () => {/test("\1", async ({ eventPage, authenticatedContext }) => {\n      const { token } = authenticatedContext;\n      if (token) eventPage.setAuthToken(token);/g' | \
    sed 's/test("\([^"]*\)", async () => {/test("\1", async ({ userPage, authenticatedContext }) => {\n      const { token } = authenticatedContext;\n      if (token) userPage.setAuthToken(token);/g' | \
    sed 's/test("\([^"]*\)", async () => {/test("\1", async ({ emergencyContactsPage, authenticatedContext }) => {\n      const { token } = authenticatedContext;\n      if (token) emergencyContactsPage.setAuthToken(token);/g' | \
    sed 's/test("\([^"]*\)", async () => {/test("\1", async ({ userPlacesPage, authenticatedContext }) => {\n      const { token } = authenticatedContext;\n      if (token) userPlacesPage.setAuthToken(token);/g'
    
  } > "$temp_file"
  
  # Replace the original with processed version
  mv "$temp_file" "$file"
  
  echo "✅ Fixed: $file"
}

# Process each file
for file in "${AUTH_FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_file "$file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo "🎉 All remaining test files have been processed!"
echo "📝 Original files backed up with .bak extension"
