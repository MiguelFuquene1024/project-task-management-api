import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string, errorCode: string) {
    super(message, 404, errorCode);
  }
}
