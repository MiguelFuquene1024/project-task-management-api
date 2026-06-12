import { NotFoundError } from '../../../../shared/errors/NotFoundError';

export class ProjectNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Project with id "${id}" not found`, 'PROJECT_NOT_FOUND');
  }
}
