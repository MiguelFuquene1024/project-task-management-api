import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { projectRoutes } from './modules/projects/infrastructure/ProjectRoutes';
import { taskRoutes } from './modules/tasks/infrastructure/TaskRoutes';
import { errorHandler } from './shared/middleware/errorHandler';
import { swaggerSpec } from './shared/swagger/swaggerConfig';
import { requestLogger } from './shared/middleware/requestLogger';
import { globalRateLimiter, writeLimiter } from './shared/middleware/rateLimiter';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(globalRateLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api', writeLimiter, projectRoutes);
app.use('/api', writeLimiter, taskRoutes);

app.use(errorHandler);

export { app };
