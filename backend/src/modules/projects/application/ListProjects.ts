import { ProjectWithStats } from '../domain/Project';
import { ProjectRepository } from '../domain/ProjectRepository';

export class ListProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  execute(): Promise<ProjectWithStats[]> {
    return this.projectRepository.findAll();
  }
}
