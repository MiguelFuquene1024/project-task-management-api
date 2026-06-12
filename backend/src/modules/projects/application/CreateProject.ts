import { Project, CreateProjectData } from '../domain/Project';
import { ProjectRepository } from '../domain/ProjectRepository';

export class CreateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  execute(data: CreateProjectData): Promise<Project> {
    return this.projectRepository.create(data);
  }
}
