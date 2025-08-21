#!/bin/bash

echo "📦 Installing dependencies..."
yarn install

echo ""
echo "🧪 Running unit tests..."
yarn test:unit

echo ""
echo "🔨 Building Jekyll site..."
bundle exec jekyll build

echo ""
echo "🌐 Running integration tests..."
yarn test:integration

echo ""
echo "📊 Generating test coverage report..."
yarn test:coverage

echo ""
echo "✅ All tests completed!"
echo "Coverage report available at ./coverage/index.html"