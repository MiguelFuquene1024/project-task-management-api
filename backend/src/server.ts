import 'dotenv/config';
import { app } from './app';
import { prisma } from './shared/lib/prisma';

const PORT = process.env.PORT ?? 3000;

async function main(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[DB] Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
