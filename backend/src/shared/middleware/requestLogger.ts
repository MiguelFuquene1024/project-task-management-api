import { pinoHttp } from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from '../logger/logger';

export const requestLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  customProps: (req) => ({ correlationId: req.id }),
  customLogLevel: (_req, res) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
