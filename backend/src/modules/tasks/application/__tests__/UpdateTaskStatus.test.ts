import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { UpdateTaskStatus } from '../UpdateTaskStatus';
import { TaskNotFoundError } from '../../domain/errors/TaskNotFoundError';
import { buildTask } from './helpers';

let repo: InMemoryTaskRepository;
let useCase: UpdateTaskStatus;

beforeEach(() => {
  repo = new InMemoryTaskRepository();
  useCase = new UpdateTaskStatus(repo);
});

describe('UpdateTaskStatus', () => {
  it('transitions status from TODO to IN_PROGRESS', async () => {
    const task = buildTask({ status: 'TODO' });
    repo.seed(task);

    const result = await useCase.execute(task.id, 'IN_PROGRESS');

    expect(result.status).toBe('IN_PROGRESS');
  });

  it('transitions status from IN_PROGRESS to DONE', async () => {
    const task = buildTask({ status: 'IN_PROGRESS' });
    repo.seed(task);

    const result = await useCase.execute(task.id, 'DONE');

    expect(result.status).toBe('DONE');
  });

  it('is idempotent: setting the same status returns the task without error', async () => {
    const task = buildTask({ status: 'DONE' });
    repo.seed(task);

    const result = await useCase.execute(task.id, 'DONE');

    expect(result.status).toBe('DONE');
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute('non-existent-id', 'DONE')).rejects.toThrow(TaskNotFoundError);
  });
});
