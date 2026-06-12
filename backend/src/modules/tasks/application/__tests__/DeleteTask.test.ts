import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { DeleteTask } from '../DeleteTask';
import { TaskNotFoundError } from '../../domain/errors/TaskNotFoundError';
import { buildTask } from './helpers';

let repo: InMemoryTaskRepository;
let useCase: DeleteTask;

beforeEach(() => {
  repo = new InMemoryTaskRepository();
  useCase = new DeleteTask(repo);
});

describe('DeleteTask', () => {
  it('deletes an existing task', async () => {
    const task = buildTask();
    repo.seed(task);

    await useCase.execute(task.id);

    const found = await repo.findById(task.id);
    expect(found).toBeNull();
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
