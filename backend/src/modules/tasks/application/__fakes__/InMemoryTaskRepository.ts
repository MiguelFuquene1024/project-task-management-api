import type { TaskRepository } from '../../domain/TaskRepository';
import type { Task, CreateTaskData, UpdateTaskData } from '../../domain/Task';

export class InMemoryTaskRepository implements TaskRepository {
  private store: Task[] = [];

  seed(task: Task): void {
    this.store.push(task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.store.find((t) => t.id === id) ?? null;
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.store.filter((t) => t.projectId === projectId);
  }

  async create(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      projectId: data.projectId,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'TODO',
      priority: data.priority ?? 'MEDIUM',
      dueDate: data.dueDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.push(task);
    return task;
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const idx = this.store.findIndex((t) => t.id === id);
    this.store[idx] = { ...this.store[idx], ...data, updatedAt: new Date() };
    return this.store[idx];
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((t) => t.id !== id);
  }
}
