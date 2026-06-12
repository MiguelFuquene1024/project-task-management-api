import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateTask } from '../application/CreateTask';
import { UpdateTask } from '../application/UpdateTask';
import { UpdateTaskStatus } from '../application/UpdateTaskStatus';
import { DeleteTask } from '../application/DeleteTask';
import { FindTaskById } from '../application/FindTaskById';
import { ListTasksByProject } from '../application/ListTasksByProject';

const dueDateSchema = z
  .string()
  .datetime({ offset: true, message: 'dueDate must be a valid ISO 8601 date' })
  .transform((v) => new Date(v))
  .nullish();

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).nullish(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE']).optional(),
  dueDate: dueDateSchema,
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullish(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE']).optional(),
  dueDate: dueDateSchema,
});

const updateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE']),
});

export class TaskController {
  constructor(
    private readonly createTask: CreateTask,
    private readonly updateTask: UpdateTask,
    private readonly updateTaskStatus: UpdateTaskStatus,
    private readonly deleteTask: DeleteTask,
    private readonly findTaskById: FindTaskById,
    private readonly listTasksByProject: ListTasksByProject,
  ) {}

  async listByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await this.listTasksByProject.execute(req.params.projectId);
      res.json({ data: tasks });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await this.findTaskById.execute(req.params.id);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await this.createTask.execute({
        ...data,
        projectId: req.params.projectId,
      });
      res.status(201).json({ data: task, message: 'Task created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateTaskSchema.parse(req.body);
      const task = await this.updateTask.execute(req.params.id, data);
      res.json({ data: task, message: 'Task updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const task = await this.updateTaskStatus.execute(req.params.id, status);
      res.json({ data: task, message: 'Task status updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteTask.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
