import { Project, UpdateProjectData } from '../domain/Project';
import { ProjectRepository } from '../domain/ProjectRepository';
import { ProjectNotFoundError } from '../domain/errors/ProjectNotFoundError';

export class UpdateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, data: UpdateProjectData): Promise<Project> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new ProjectNotFoundError(id);
    return this.projectRepository.update(id, data);
  }
}
