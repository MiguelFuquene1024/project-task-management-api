import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
import { ProjectRepository } from '../../projects/domain/ProjectRepository';
import { ProjectNotFoundError } from '../../projects/domain/errors/ProjectNotFoundError';

export class ListTasksByProject {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(projectId: string): Promise<Task[]> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new ProjectNotFoundError(projectId);
    return this.taskRepository.findByProjectId(projectId);
  }
}
