#!/bin/bash
# Quick Fix Script for Frontend-Backend Integration Issues
# Run this from the project root directory

echo "🔧 Fixing Frontend-Backend Integration Issues..."
echo ""

# Navigate to frontend directory
cd frontend || exit

echo "📦 Installing missing dependencies..."
npm install xlsx jspdf jspdf-autotable

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Test the Report Export features (Excel/PDF)"
echo "2. Verify all components are working"
echo "3. Run 'npm start' to test locally"
echo ""
echo "🎉 Quick fixes completed!"
