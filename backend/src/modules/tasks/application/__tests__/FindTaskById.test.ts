import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { FindTaskById } from '../FindTaskById';
import { TaskNotFoundError } from '../../domain/errors/TaskNotFoundError';
import { buildTask } from './helpers';

let repo: InMemoryTaskRepository;
let useCase: FindTaskById;

beforeEach(() => {
  repo = new InMemoryTaskRepository();
  useCase = new FindTaskById(repo);
});

describe('FindTaskById', () => {
  it('returns the task when it exists', async () => {
    const task = buildTask({ title: 'My Task' });
    repo.seed(task);

    const result = await useCase.execute(task.id);

    expect(result.id).toBe(task.id);
    expect(result.title).toBe('My Task');
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(TaskNotFoundError);
  });

  it('thrown error carries correct errorCode', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toMatchObject({
      errorCode: 'TASK_NOT_FOUND',
    });
  });
});
