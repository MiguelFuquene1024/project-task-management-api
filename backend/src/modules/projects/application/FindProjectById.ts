import { ProjectWithStats } from '../domain/Project';
import { ProjectRepository } from '../domain/ProjectRepository';
import { ProjectNotFoundError } from '../domain/errors/ProjectNotFoundError';

export class FindProjectById {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<ProjectWithStats> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new ProjectNotFoundError(id);
    return project;
  }
}
