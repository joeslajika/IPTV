#!/bin/bash

# Banking System Installation Script

echo "🏦 Installing Banking System..."

# Install backend dependencies
cd banking-system
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created - Please configure it"
fi

# Install frontend dependencies
cd frontend
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure .env file with your settings"
echo "2. Start MongoDB: mongod"
echo "3. Start Backend: npm run dev"
echo "4. Start Frontend: cd frontend && npm start"
echo ""
echo "🚀 Backend will run on http://localhost:5000"
echo "🚀 Frontend will run on http://localhost:3000"
