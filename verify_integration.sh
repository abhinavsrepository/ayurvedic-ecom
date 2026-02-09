#!/bin/bash

# Ayurveda Shop API Integration Verification Script
# This script verifies that all API endpoints are properly integrated

echo "🚀 Ayurveda Shop API Integration Verification"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if backend is running
print_info "Checking if backend is running..."
if curl -s http://localhost:3333 > /dev/null; then
    print_success "Backend is running on http://localhost:3333"
else
    print_error "Backend is not running. Please start the backend first."
    print_info "Run: cd ayurveda-api && npm run start:dev"
    exit 1
fi

# Test all critical endpoints
echo ""
echo "🔍 Testing API Endpoints"
echo "======================="

# Test 1: Health Check
echo -n "Testing health check... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/ | grep -q "200"; then
    print_success "Health check passed"
else
    print_error "Health check failed"
fi

# Test 2: Products API
echo -n "Testing products API... "
if curl -s http://localhost:3333/products?page=0&size=10 > /dev/null; then
    print_success "Products API working"
else
    print_error "Products API failed"
fi

# Test 3: Search API
echo -n "Testing products search... "
if curl -s http://localhost:3333/products/search?q=herbs&page=0&size=10 > /dev/null; then
    print_success "Products search working"
else
    print_error "Products search failed"
fi

# Test 4: Authentication
echo -n "Testing authentication endpoint... "
if curl -s -X POST http://localhost:3333/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' > /dev/null; then
    print_success "Authentication endpoint working"
else
    print_info "Authentication endpoint failed (may need valid credentials)"
fi

# Test 5: Cart API
echo -n "Testing cart API... "
if curl -s -H "x-session-id: test-session-id" http://localhost:3333/cart > /dev/null; then
    print_success "Cart API working"
else
    print_error "Cart API failed"
fi

# Test 6: Blog API
echo -n "Testing blog API... "
if curl -s http://localhost:3333/blog/posts > /dev/null; then
    print_success "Blog API working"
else
    print_error "Blog API failed"
fi

# Test 7: Customers API
echo -n "Testing customers API... "
if curl -s http://localhost:3333/customers > /dev/null; then
    print_success "Customers API working"
else
    print_error "Customers API failed"
fi

# Test 8: Orders API
echo -n "Testing orders API... "
if curl -s http://localhost:3333/orders > /dev/null; then
    print_success "Orders API working"
else
    print_error "Orders API failed"
fi

# Test 9: Reviews API
echo -n "Testing reviews API... "
if curl -s http://localhost:3333/reviews/product/test-product > /dev/null; then
    print_success "Reviews API working"
else
    print_error "Reviews API failed"
fi

# Test 10: Addresses API
echo -n "Testing addresses API... "
if curl -s http://localhost:3333/addresses > /dev/null; then
    print_success "Addresses API working"
else
    print_error "Addresses API failed"
fi

# Test 11: Users API
echo -n "Testing users API... "
if curl -s http://localhost:3333/users/me > /dev/null; then
    print_success "Users API working"
else
    print_error "Users API failed"
fi

# Test 12: Payments API
echo -n "Testing payments API... "
if curl -s http://localhost:3333/payments/create > /dev/null; then
    print_success "Payments API working"
else
    print_error "Payments API failed"
fi

# Summary
echo ""
echo "📊 Integration Summary"
echo "====================="
echo ""
echo "Total Endpoints Tested: 12"
echo "Success: $(( $(grep -c 'working' <<< "$result") ))"
echo "Failed: $(( $(grep -c 'failed' <<< "$result") ))"
echo ""

# Check frontend API files
echo "🔍 Verifying Frontend API Files"
echo "==============================="
echo ""

# Check Products API
if grep -q "search: async" ayurveda-shop/lib/api/products.ts && \
   grep -q "updateStock: async" ayurveda-shop/lib/api/products.ts; then
    print_success "Products API properly configured"
else
    print_error "Products API not properly configured"
fi

# Check Orders API
if grep -q "cancel: async" ayurveda-shop/lib/api/orders.ts && \
   grep -q "track: async" ayurveda-shop/lib/api/orders.ts && \
   grep -q "exportOrders: async" ayurveda-shop/lib/api/orders.ts; then
    print_success "Orders API properly configured"
else
    print_error "Orders API not properly configured"
fi

# Check Customers API
if grep -q "search: async" ayurveda-shop/lib/api/customers.ts && \
   grep -q "getStats: async" ayurveda-shop/lib/api/customers.ts && \
   grep -q "exportCustomers: async" ayurveda-shop/lib/api/customers.ts; then
    print_success "Customers API properly configured"
else
    print_error "Customers API not properly configured"
fi

# Check Admin API
if grep -q "cancelOrder: async" ayurveda-shop/lib/api/admin.ts && \
   grep -q "searchCustomers: async" ayurveda-shop/lib/api/admin.ts && \
   grep -q "exportCustomers: async" ayurveda-shop/lib/api/admin.ts; then
    print_success "Admin API properly configured"
else
    print_error "Admin API not properly configured"
fi

# Final Status
echo ""
echo "🎯 Final Status"
echo "==============="
echo ""

if grep -q "working" <<< "$result" && ! grep -q "failed" <<< "$result"; then
    print_success "✨ All integrations are working perfectly!"
    echo ""
    echo "The Ayurveda Shop website is ready for use."
    exit 0
else
    print_error "⚠️  Some integrations are not working correctly."
    echo ""
    echo "Please check the errors above and ensure:"
    echo "1. Backend is running on port 3333"
    echo "2. Frontend environment variables are properly configured"
    echo "3. Database is accessible and has data"
    exit 1
fi
