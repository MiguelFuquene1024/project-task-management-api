#!/bin/sh
set -e

echo "Pushing Prisma schema to database..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx prisma db seed

echo "Starting server..."
exec "$@"
