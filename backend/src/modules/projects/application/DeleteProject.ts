import { ProjectRepository } from '../domain/ProjectRepository';
import { ProjectNotFoundError } from '../domain/errors/ProjectNotFoundError';

export class DeleteProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new ProjectNotFoundError(id);
    await this.projectRepository.delete(id);
  }
}
