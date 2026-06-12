import { NotFoundError } from '../../../../shared/errors/NotFoundError';

export class TaskNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Task with id "${id}" not found`, 'TASK_NOT_FOUND');
  }
}
