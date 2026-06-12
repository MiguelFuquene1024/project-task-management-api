import { PrismaClient } from '@prisma/client';
import { ProjectRepository } from '../domain/ProjectRepository';
import {
  Project,
  ProjectWithStats,
  CreateProjectData,
  UpdateProjectData,
} from '../domain/Project';

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<ProjectWithStats[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } },
      },
    });

    return projects.map(({ _count, tasks, ...project }) => ({
      ...project,
      taskCount: _count.tasks,
      tasksByStatus: {
        TODO: tasks.filter((t) => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        DONE: tasks.filter((t) => t.status === 'DONE').length,
      },
    }));
  }

  async findById(id: string): Promise<ProjectWithStats | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } },
      },
    });

    if (!project) return null;

    const { _count, tasks, ...rest } = project;
    return {
      ...rest,
      taskCount: _count.tasks,
      tasksByStatus: {
        TODO: tasks.filter((t) => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        DONE: tasks.filter((t) => t.status === 'DONE').length,
      },
    };
  }

  create(data: CreateProjectData): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  update(id: string, data: UpdateProjectData): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
