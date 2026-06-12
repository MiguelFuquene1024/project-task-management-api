import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '../domain/TaskRepository';
import { Task, CreateTaskData, UpdateTaskData } from '../domain/Task';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } }) as Promise<Task | null>;
  }

  findByProjectId(projectId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Task[]>;
  }

  create(data: CreateTaskData): Promise<Task> {
    return this.prisma.task.create({ data }) as Promise<Task>;
  }

  update(id: string, data: UpdateTaskData): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data }) as Promise<Task>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
