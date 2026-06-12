import { Task, UpdateTaskData } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
import { TaskNotFoundError } from '../domain/errors/TaskNotFoundError';

export class UpdateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, data: UpdateTaskData): Promise<Task> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) throw new TaskNotFoundError(id);
    return this.taskRepository.update(id, data);
  }
}
