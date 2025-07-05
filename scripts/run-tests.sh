#!/bin/bash

# Test Coverage Script for ForSure Backend
# This script runs all tests and generates a comprehensive coverage report

echo "🧪 Starting ForSure Backend Test Suite..."
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Set exit on error
set -e

# 1. Run linting
echo -e "\n${YELLOW}🔍 Running ESLint...${NC}"
if npm run lint; then
    print_status "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# 2. Run type checking
echo -e "\n${YELLOW}🔍 Running TypeScript type checking...${NC}"
if npm run type-check; then
    print_status "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# 3. Run unit tests with coverage
echo -e "\n${YELLOW}🧪 Running unit tests with coverage...${NC}"
if npm run test:ci; then
    print_status "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# 4. Check coverage thresholds
echo -e "\n${YELLOW}📊 Checking coverage thresholds...${NC}"
COVERAGE_DIR="coverage"
if [ -d "$COVERAGE_DIR" ]; then
    # Parse coverage summary
    if [ -f "$COVERAGE_DIR/coverage-summary.json" ]; then
        COVERAGE_PERCENT=$(node -e "
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('$COVERAGE_DIR/coverage-summary.json', 'utf8'));
            const total = coverage.total;
            console.log(Math.round(total.statements.pct));
        ")
        
        if [ "$COVERAGE_PERCENT" -ge 80 ]; then
            print_status "Coverage is $COVERAGE_PERCENT% (target: 80%)"
        else
            print_warning "Coverage is $COVERAGE_PERCENT% (below target: 80%)"
        fi
    else
        print_warning "Coverage summary not found"
    fi
else
    print_warning "Coverage directory not found"
fi

# 5. Run API endpoint tests
echo -e "\n${YELLOW}🌐 Running API endpoint tests...${NC}"
API_TEST_FILES=$(find __tests__/api -name "*.test.ts" -o -name "*.test.js" 2>/dev/null | wc -l)
if [ "$API_TEST_FILES" -gt 0 ]; then
    print_status "Found $API_TEST_FILES API test files"
    if npm run test -- --testPathPattern="__tests__/api"; then
        print_status "API tests passed"
    else
        print_error "API tests failed"
        exit 1
    fi
else
    print_warning "No API test files found"
fi

# 6. Generate test report
echo -e "\n${YELLOW}📋 Generating test report...${NC}"
cat > test-report.md << EOF
# ForSure Backend Test Report

**Generated on:** $(date)

## Test Results Summary

### ✅ Passed Tests
- ESLint: Passed
- TypeScript: Passed  
- Unit Tests: Passed
- API Tests: Passed

### 📊 Coverage Report
- Target Coverage: 80%
- Current Coverage: ${COVERAGE_PERCENT:-Unknown}%

### 📁 Test Files
- Total API test files: $API_TEST_FILES
- Coverage files: $(find coverage -name "*.json" 2>/dev/null | wc -l)

### 🔧 Recommendations
EOF

if [ "${COVERAGE_PERCENT:-0}" -lt 80 ]; then
    echo "- Increase test coverage to reach 80% target" >> test-report.md
fi

if [ "$API_TEST_FILES" -lt 5 ]; then
    echo "- Add more API endpoint tests" >> test-report.md
fi

echo "- Consider adding integration tests" >> test-report.md
echo "- Add end-to-end tests for critical user flows" >> test-report.md

print_status "Test report generated: test-report.md"

# 7. Final summary
echo -e "\n${GREEN}==========================================="
echo -e "🎉 All tests completed successfully!"
echo -e "📊 Coverage: ${COVERAGE_PERCENT:-Unknown}%"
echo -e "📋 Full report: test-report.md"
echo -e "===========================================${NC}"

exit 0
