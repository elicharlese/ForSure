#!/bin/bash

# ForSure Production Deployment Script
# This script handles the complete deployment process to Vercel

echo "🚀 Starting ForSure Production Deployment..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_tools() {
    print_info "Checking required tools..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Please install it first:"
        echo "npm i -g vercel"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git not found. Please install Git first."
        exit 1
    fi
    
    print_status "All required tools are installed"
}

# Pre-deployment checks
pre_deployment_checks() {
    print_info "Running pre-deployment checks..."
    
    # Check if we're on the main branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_warning "Not on main branch. Current branch: $CURRENT_BRANCH"
        read -p "Continue deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes detected"
        read -p "Continue deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
    
    print_status "Pre-deployment checks passed"
}

# Run tests
run_tests() {
    print_info "Running tests..."
    
    if [ -f "scripts/run-tests.sh" ]; then
        if bash scripts/run-tests.sh; then
            print_status "All tests passed"
        else
            print_error "Tests failed"
            exit 1
        fi
    else
        print_warning "Test script not found, running basic tests..."
        
        # Run basic tests
        if npm run test:ci; then
            print_status "Basic tests passed"
        else
            print_error "Basic tests failed"
            exit 1
        fi
    fi
}

# Build the application
build_application() {
    print_info "Building application..."
    
    if npm run build; then
        print_status "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_info "Deploying to Vercel..."
    
    # Deploy to production
    if vercel --prod; then
        print_status "Deployment completed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Post-deployment verification
post_deployment_verification() {
    print_info "Running post-deployment verification..."
    
    # Get the deployment URL
    DEPLOY_URL=$(vercel ls --scope $(vercel whoami) | grep "$(basename $(pwd))" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOY_URL" ]; then
        print_status "Deployment URL: https://$DEPLOY_URL"
        
        # Basic health check
        if curl -f -s "https://$DEPLOY_URL/api/health" > /dev/null; then
            print_status "Health check passed"
        else
            print_warning "Health check failed - API may not be ready yet"
        fi
    else
        print_warning "Could not determine deployment URL"
    fi
}

# Environment variable check
check_env_vars() {
    print_info "Checking environment variables..."
    
    # Check if .env.example exists
    if [ ! -f ".env.example" ]; then
        print_warning ".env.example not found"
        return
    fi
    
    # Read required variables from .env.example
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "JWT_SECRET"
    )
    
    print_info "Verifying required environment variables are set in Vercel..."
    
    for var in "${REQUIRED_VARS[@]}"; do
        if vercel env ls | grep -q "$var"; then
            print_status "$var is set"
        else
            print_warning "$var is not set in Vercel"
        fi
    done
}

# Main deployment flow
main() {
    echo -e "${BLUE}🚀 ForSure Production Deployment${NC}"
    echo "=================================="
    
    # Step 1: Check tools
    check_tools
    
    # Step 2: Pre-deployment checks
    pre_deployment_checks
    
    # Step 3: Check environment variables
    check_env_vars
    
    # Step 4: Run tests
    run_tests
    
    # Step 5: Build application
    build_application
    
    # Step 6: Deploy to Vercel
    deploy_to_vercel
    
    # Step 7: Post-deployment verification
    post_deployment_verification
    
    # Success message
    echo -e "\n${GREEN}=============================================="
    echo -e "🎉 Deployment completed successfully!"
    echo -e "🌐 Your application is now live on Vercel"
    echo -e "==============================================\n${NC}"
    
    # Next steps
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Test your application in production"
    echo "2. Monitor logs and performance"
    echo "3. Update DNS settings if needed"
    echo "4. Configure monitoring and alerts"
}

# Error handling
set -e
trap 'print_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
