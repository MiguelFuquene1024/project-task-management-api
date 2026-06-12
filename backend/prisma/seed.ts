import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.project.count();
  if (existing > 0) return;

  const ecommerce = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Full rewrite of the online store with improved performance and UX.',
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: 'Mobile App v2',
      description: 'React Native app with offline support and push notifications.',
    },
  });

  const apiGateway = await prisma.project.create({
    data: {
      name: 'API Gateway Migration',
      description: 'Migrate from monolith to microservices with an API gateway layer.',
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.task.createMany({
    data: [
      // E-commerce
      {
        projectId: ecommerce.id,
        title: 'Set up product catalog schema',
        description: 'Define Prisma models for products, variants and categories.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: lastWeek,
      },
      {
        projectId: ecommerce.id,
        title: 'Implement cart persistence',
        description: 'Store cart state in Redis with TTL of 30 days.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: lastWeek,
      },
      {
        projectId: ecommerce.id,
        title: 'Payment gateway integration',
        description: 'Integrate Stripe with webhook support for async payment confirmation.',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        dueDate: tomorrow,
      },
      {
        projectId: ecommerce.id,
        title: 'Product image optimization pipeline',
        description: 'Auto-resize and convert uploads to WebP via Sharp.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: nextWeek,
      },
      {
        projectId: ecommerce.id,
        title: 'Checkout flow UI',
        description: 'Multi-step checkout with address, shipping and payment steps.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: nextWeek,
      },
      {
        projectId: ecommerce.id,
        title: 'Email notifications',
        description: 'Order confirmation and shipping updates via SendGrid.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
      },
      {
        projectId: ecommerce.id,
        title: 'Third-party inventory sync',
        description: 'Blocked waiting for supplier API credentials.',
        status: 'BLOCKED',
        priority: 'HIGH',
        dueDate: tomorrow,
      },

      // Mobile App
      {
        projectId: mobileApp.id,
        title: 'Offline-first architecture',
        description: 'Implement WatermelonDB for local persistence with sync conflict resolution.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: nextWeek,
      },
      {
        projectId: mobileApp.id,
        title: 'Push notification service',
        description: 'FCM + APNs integration with topic-based subscriptions.',
        status: 'IN_REVIEW',
        priority: 'MEDIUM',
        dueDate: tomorrow,
      },
      {
        projectId: mobileApp.id,
        title: 'Biometric authentication',
        description: 'FaceID and fingerprint login using expo-local-authentication.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: nextWeek,
      },
      {
        projectId: mobileApp.id,
        title: 'Deep linking setup',
        description: 'Blocked on App Store Connect configuration approval.',
        status: 'BLOCKED',
        priority: 'LOW',
        dueDate: null,
      },
      {
        projectId: mobileApp.id,
        title: 'App store screenshots',
        description: 'Generate screenshots for all device sizes.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: null,
      },

      // API Gateway
      {
        projectId: apiGateway.id,
        title: 'Service discovery with Consul',
        description: 'Register all microservices and configure health checks.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: lastWeek,
      },
      {
        projectId: apiGateway.id,
        title: 'JWT validation middleware',
        description: 'Centralized auth at the gateway level — services trust the gateway.',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        dueDate: tomorrow,
      },
      {
        projectId: apiGateway.id,
        title: 'Rate limiting per consumer',
        description: 'Token bucket algorithm with Redis backend.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: nextWeek,
      },
      {
        projectId: apiGateway.id,
        title: 'Request tracing with OpenTelemetry',
        description: 'Distributed tracing across all downstream services.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
      },
      {
        projectId: apiGateway.id,
        title: 'Circuit breaker implementation',
        description: 'Blocked — depends on service mesh decision still in discussion.',
        status: 'BLOCKED',
        priority: 'HIGH',
        dueDate: null,
      },
    ],
  });

  console.log('Seed completed: 3 projects, 17 tasks');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
