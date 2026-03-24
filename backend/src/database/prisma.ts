import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
  });

  prisma.$on('error', (e) => {
    logger.error(`Error: ${e.message}`);
  });

  prisma.$on('warn', (e) => {
    logger.warn(`Warning: ${e.message}`);
  });
}

// Handle connection errors
prisma.$on('error', (e) => {
  logger.error('❌ Prisma Error:', e);
});

export default prisma;
