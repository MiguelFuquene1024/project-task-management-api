import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
import { TaskNotFoundError } from '../domain/errors/TaskNotFoundError';

export class FindTaskById {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }
}
