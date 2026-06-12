import type { ProjectRepository } from '../../domain/ProjectRepository';
import type {
  Project,
  ProjectWithStats,
  CreateProjectData,
  UpdateProjectData,
} from '../../domain/Project';

export class InMemoryProjectRepository implements ProjectRepository {
  private store: ProjectWithStats[] = [];

  seed(project: ProjectWithStats): void {
    this.store.push(project);
  }

  async findAll(): Promise<ProjectWithStats[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<ProjectWithStats | null> {
    return this.store.find((p) => p.id === id) ?? null;
  }

  async create(data: CreateProjectData): Promise<Project> {
    const project: ProjectWithStats = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskCount: 0,
      tasksByStatus: { TODO: 0, IN_PROGRESS: 0, BLOCKED: 0, IN_REVIEW: 0, DONE: 0 },
    };
    this.store.push(project);
    return project;
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const idx = this.store.findIndex((p) => p.id === id);
    this.store[idx] = { ...this.store[idx], ...data, updatedAt: new Date() };
    return this.store[idx];
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((p) => p.id !== id);
  }
}
