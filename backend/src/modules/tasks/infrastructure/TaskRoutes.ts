import { Router } from 'express';
import { prisma } from '../../../shared/lib/prisma';
import { PrismaTaskRepository } from './PrismaTaskRepository';
import { PrismaProjectRepository } from '../../projects/infrastructure/PrismaProjectRepository';
import { TaskController } from './TaskController';
import { CreateTask } from '../application/CreateTask';
import { UpdateTask } from '../application/UpdateTask';
import { UpdateTaskStatus } from '../application/UpdateTaskStatus';
import { DeleteTask } from '../application/DeleteTask';
import { FindTaskById } from '../application/FindTaskById';
import { ListTasksByProject } from '../application/ListTasksByProject';

const taskRepository = new PrismaTaskRepository(prisma);
const projectRepository = new PrismaProjectRepository(prisma);

const controller = new TaskController(
  new CreateTask(taskRepository, projectRepository),
  new UpdateTask(taskRepository),
  new UpdateTaskStatus(taskRepository),
  new DeleteTask(taskRepository),
  new FindTaskById(taskRepository),
  new ListTasksByProject(taskRepository, projectRepository),
);

const router = Router();

router.get('/projects/:projectId/tasks', controller.listByProject.bind(controller));
router.post('/projects/:projectId/tasks', controller.create.bind(controller));
router.get('/tasks/:id', controller.findById.bind(controller));
router.put('/tasks/:id', controller.update.bind(controller));
router.patch('/tasks/:id/status', controller.updateStatus.bind(controller));
router.delete('/tasks/:id', controller.delete.bind(controller));

export { router as taskRoutes };
