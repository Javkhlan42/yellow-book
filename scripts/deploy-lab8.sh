#!/bin/bash
# Lab 8 Deployment Script
# Deploy Redis, update secrets, and restart services

set -e

echo "🚀 Starting Lab 8 deployment..."

# Apply secrets with OpenAI API key
echo "📝 Applying secrets..."
kubectl apply -f k8s/secrets.yaml

# Deploy Redis
echo "🔴 Deploying Redis..."
kubectl apply -f k8s/redis-deployment.yaml

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
kubectl wait --for=condition=ready pod -l app=redis -n yellowbooks --timeout=60s

# Restart backend to pick up new secrets
echo "🔄 Restarting backend pods..."
kubectl rollout restart deployment/backend -n yellowbooks

# Wait for backend rollout
echo "⏳ Waiting for backend rollout..."
kubectl rollout status deployment/backend -n yellowbooks --timeout=120s

# Run migration job with seed data
echo "🗄️  Running database migration and seed..."
kubectl delete job prisma-migrate -n yellowbooks --ignore-not-found=true
kubectl apply -f k8s/migration-job.yaml

# Wait for migration to complete
echo "⏳ Waiting for migration job..."
kubectl wait --for=condition=complete job/prisma-migrate -n yellowbooks --timeout=180s

# Check migration logs
echo "📋 Migration logs:"
kubectl logs job/prisma-migrate -n yellowbooks

echo "✅ Lab 8 deployment complete!"
echo ""
echo "📊 Current status:"
kubectl get pods -n yellowbooks
echo ""
echo "🔗 Access the application at:"
echo "   Frontend: http://sharnom.systems:31003"
echo "   Backend API: http://sharnom.systems:31529"
echo ""
echo "🧪 Test AI search:"
echo "   Visit: http://sharnom.systems:31003/yellow-books/assistant"
