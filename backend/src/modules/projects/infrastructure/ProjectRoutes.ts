import { Router } from 'express';
import { prisma } from '../../../shared/lib/prisma';
import { PrismaProjectRepository } from './PrismaProjectRepository';
import { ProjectController } from './ProjectController';
import { CreateProject } from '../application/CreateProject';
import { UpdateProject } from '../application/UpdateProject';
import { DeleteProject } from '../application/DeleteProject';
import { FindProjectById } from '../application/FindProjectById';
import { ListProjects } from '../application/ListProjects';

const projectRepository = new PrismaProjectRepository(prisma);

const controller = new ProjectController(
  new CreateProject(projectRepository),
  new UpdateProject(projectRepository),
  new DeleteProject(projectRepository),
  new FindProjectById(projectRepository),
  new ListProjects(projectRepository),
);

const router = Router();

router.get('/projects', controller.list.bind(controller));
router.get('/projects/:id', controller.findById.bind(controller));
router.post('/projects', controller.create.bind(controller));
router.put('/projects/:id', controller.update.bind(controller));
router.delete('/projects/:id', controller.delete.bind(controller));

export { router as projectRoutes };
