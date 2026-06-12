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
import type { TaskRepository } from '../domain/TaskRepository';
import type { ProjectRepository } from '../../projects/domain/ProjectRepository';

export function createTaskRouter(
  taskRepository: TaskRepository,
  projectRepository: ProjectRepository,
): Router {
  const controller = new TaskController(
    new CreateTask(taskRepository, projectRepository),
    new UpdateTask(taskRepository),
    new UpdateTaskStatus(taskRepository),
    new DeleteTask(taskRepository),
    new FindTaskById(taskRepository),
    new ListTasksByProject(taskRepository, projectRepository),
  );

  const router = Router();

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: List all tasks for a project
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/projects/:projectId/tasks', controller.listByProject.bind(controller));

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Create a task in a project
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/projects/:projectId/tasks', controller.create.bind(controller));

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tasks/:id', controller.findById.bind(controller));

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/tasks/:id', controller.update.bind(controller));

/**
 * @openapi
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status (used by Kanban drag-and-drop)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/tasks/:id/status', controller.updateStatus.bind(controller));

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
  router.delete('/tasks/:id', controller.delete.bind(controller));

  return router;
}

export const taskRoutes = createTaskRouter(
  new PrismaTaskRepository(prisma),
  new PrismaProjectRepository(prisma),
);
