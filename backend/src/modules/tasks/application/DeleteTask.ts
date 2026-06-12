import { TaskRepository } from '../domain/TaskRepository';
import { TaskNotFoundError } from '../domain/errors/TaskNotFoundError';

export class DeleteTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) throw new TaskNotFoundError(id);
    await this.taskRepository.delete(id);
  }
}
