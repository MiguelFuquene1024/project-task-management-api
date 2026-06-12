import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { UpdateTask } from '../UpdateTask';
import { TaskNotFoundError } from '../../domain/errors/TaskNotFoundError';
import { buildTask } from './helpers';

let repo: InMemoryTaskRepository;
let useCase: UpdateTask;

beforeEach(() => {
  repo = new InMemoryTaskRepository();
  useCase = new UpdateTask(repo);
});

describe('UpdateTask', () => {
  it('updates and returns the task with new data', async () => {
    const task = buildTask({ title: 'Old Title' });
    repo.seed(task);

    const result = await useCase.execute(task.id, { title: 'New Title' });

    expect(result.title).toBe('New Title');
  });

  it('updates priority independently of other fields', async () => {
    const task = buildTask({ priority: 'LOW' });
    repo.seed(task);

    const result = await useCase.execute(task.id, { priority: 'HIGH' });

    expect(result.priority).toBe('HIGH');
  });

  it('throws TaskNotFoundError when task does not exist', async () => {
    await expect(useCase.execute('non-existent-id', { title: 'X' })).rejects.toThrow(
      TaskNotFoundError,
    );
  });
});
