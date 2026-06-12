import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { projectRoutes } from './modules/projects/infrastructure/ProjectRoutes';
import { taskRoutes } from './modules/tasks/infrastructure/TaskRoutes';
import { errorHandler } from './shared/middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

app.use(errorHandler);

export { app };
