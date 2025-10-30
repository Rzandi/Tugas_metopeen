#!/bin/bash

# Frontend setup
echo "Setting up frontend..."
npm install

# Backend setup
echo "Setting up backend..."
cd backend
npm install

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate app key
echo "APP_KEY=base64:$(openssl rand -base64 32)" >> .env

# Create database if not exists
echo "Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS frozen_food_db"

# Run migrations
echo "Running migrations..."
php artisan migrate:fresh --seed

echo "Setup complete!"