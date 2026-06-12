import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateProject } from '../application/CreateProject';
import { UpdateProject } from '../application/UpdateProject';
import { DeleteProject } from '../application/DeleteProject';
import { FindProjectById } from '../application/FindProjectById';
import { ListProjects } from '../application/ListProjects';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500).nullish(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullish(),
});

export class ProjectController {
  constructor(
    private readonly createProject: CreateProject,
    private readonly updateProject: UpdateProject,
    private readonly deleteProject: DeleteProject,
    private readonly findProjectById: FindProjectById,
    private readonly listProjects: ListProjects,
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await this.listProjects.execute();
      res.json({ data: projects });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await this.findProjectById.execute(req.params.id);
      res.json({ data: project });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createProjectSchema.parse(req.body);
      const project = await this.createProject.execute(data);
      res.status(201).json({ data: project, message: 'Project created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateProjectSchema.parse(req.body);
      const project = await this.updateProject.execute(req.params.id, data);
      res.json({ data: project, message: 'Project updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteProject.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
