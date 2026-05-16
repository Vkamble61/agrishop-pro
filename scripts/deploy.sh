#!/bin/bash

# AgriShop Pro Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting AgriShop Pro Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_error ".env.production file not found!"
    print_warning "Please create .env.production with your production configuration"
    exit 1
fi

print_success ".env.production found"

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker Compose is installed"

# Stop existing containers
echo ""
echo "📦 Stopping existing containers..."
docker-compose down || true
print_success "Existing containers stopped"

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo ""
    echo "📥 Pulling latest changes from git..."
    git pull origin main || print_warning "Git pull failed or not configured"
fi

# Install dependencies
echo ""
echo "📚 Installing dependencies..."
npm install --production
cd client && npm install --production && cd ..
print_success "Dependencies installed"

# Build client
echo ""
echo "🏗️  Building client application..."
cd client && npm run build && cd ..
print_success "Client built successfully"

# Build Docker images
echo ""
echo "🐳 Building Docker images..."
docker-compose build --no-cache
print_success "Docker images built"

# Start containers
echo ""
echo "🚀 Starting containers..."
docker-compose up -d
print_success "Containers started"

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
echo ""
echo "🏥 Checking application health..."
HEALTH_CHECK=$(curl -s http://localhost:5000/health | grep -o '"status":"healthy"' || echo "")

if [ -n "$HEALTH_CHECK" ]; then
    print_success "Application is healthy!"
else
    print_error "Application health check failed!"
    echo "Checking logs..."
    docker-compose logs --tail=50 app
    exit 1
fi

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose ps

# Show logs
echo ""
echo "📝 Recent logs:"
docker-compose logs --tail=20 app

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "Application is running at:"
echo "  - API: http://localhost:5000"
echo "  - Health: http://localhost:5000/health"
echo ""
echo "To view logs: docker-compose logs -f app"
echo "To stop: docker-compose down"
echo ""

# Made with Bob
