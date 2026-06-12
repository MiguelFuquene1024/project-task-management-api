import { Task, CreateTaskData } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
import { ProjectRepository } from '../../projects/domain/ProjectRepository';
import { ProjectNotFoundError } from '../../projects/domain/errors/ProjectNotFoundError';

export class CreateTask {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(data: CreateTaskData): Promise<Task> {
    const project = await this.projectRepository.findById(data.projectId);
    if (!project) throw new ProjectNotFoundError(data.projectId);
    return this.taskRepository.create(data);
  }
}
