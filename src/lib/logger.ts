import 'server-only';

import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
});

export const createApiLogger = (route: string) =>
  logger.child({ context: 'api', route });

export const createServiceLogger = (service: string) =>
  logger.child({ context: 'service', service });
