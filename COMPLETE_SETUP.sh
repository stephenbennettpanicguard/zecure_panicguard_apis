#!/bin/bash

# Complete Setup Script for PG21 API Testing Framework
# This script will move the project and prepare it for GitHub push

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     🚀 PG21 API Testing Framework - Complete Setup          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Create target directory
echo "📁 Step 1: Creating directory structure..."
mkdir -p /Users/stephenbennett/Documents/github/Zecure_APIs
echo "✅ Directory created"
echo ""

# Step 2: Move project
echo "📦 Step 2: Moving project to new location..."
if [ -d "/Users/stephenbennett/Documents/Zecure_APIs/zecure_panicguard_apis" ]; then
    mv /Users/stephenbennett/Documents/Zecure_APIs/zecure_panicguard_apis \
       /Users/stephenbennett/Documents/github/Zecure_APIs/zecure_panicguard_apis
    echo "✅ Project moved successfully"
else
    echo "⚠️  Source directory not found. Checking if already moved..."
    if [ -d "/Users/stephenbennett/Documents/github/Zecure_APIs/zecure_panicguard_apis" ]; then
        echo "✅ Project already at destination"
    else
        echo "❌ Project not found. Please check the location."
        exit 1
    fi
fi
echo ""

# Step 3: Navigate to project
echo "📂 Step 3: Navigating to project..."
cd /Users/stephenbennett/Documents/github/Zecure_APIs/zecure_panicguard_apis
echo "✅ Current directory: $(pwd)"
echo ""

# Step 4: Check git status
echo "🔍 Step 4: Checking git repository..."
if [ -d ".git" ]; then
    echo "✅ Git repository found"
    git status
    echo ""
    echo "📝 Commits ready to push:"
    git log --oneline -3
    echo ""
    echo "🔗 Remote repository:"
    git remote -v
else
    echo "❌ Git repository not found!"
    exit 1
fi
echo ""

# Step 5: Provide next steps
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Project Location:"
echo "   /Users/stephenbennett/Documents/github/Zecure_APIs/zecure_panicguard_apis"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY:"
echo "   Go to: https://github.com/new"
echo "   - Name: zecure_panicguard_apis"
echo "   - Owner: stephenbennettpanicguard"
echo "   - ⚠️  DO NOT initialize with README"
echo "   - Click 'Create repository'"
echo ""
echo "2️⃣  PUSH YOUR CODE:"
echo "   git push -u origin main"
echo ""
echo "3️⃣  ADD SECRETS (Settings → Secrets → Actions):"
echo "   - TEST_USERNAME: stephen.bennett+TestAccount@panicguard.com"
echo "   - TEST_PASSWORD: password123!"
echo "   - TEST_PIN: 0408"
echo ""
echo "4️⃣  ENABLE GITHUB PAGES (Settings → Pages):"
echo "   - Branch: gh-pages"
echo "   - Save"
echo ""
echo "🌐 Your GitHub Pages URL (after workflow runs):"
echo "   https://stephenbennettpanicguard.github.io/zecure_panicguard_apis/"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║            🎉 All files are safe and ready! 🎉               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

