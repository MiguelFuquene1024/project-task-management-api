import { InMemoryProjectRepository } from '../__fakes__/InMemoryProjectRepository';
import { UpdateProject } from '../UpdateProject';
import { ProjectNotFoundError } from '../../domain/errors/ProjectNotFoundError';
import { buildProject } from './helpers';

let repo: InMemoryProjectRepository;
let useCase: UpdateProject;

beforeEach(() => {
  repo = new InMemoryProjectRepository();
  useCase = new UpdateProject(repo);
});

describe('UpdateProject', () => {
  it('updates and returns the project with new data', async () => {
    const project = buildProject({ name: 'Old Name' });
    repo.seed(project);

    const result = await useCase.execute(project.id, { name: 'New Name' });

    expect(result.name).toBe('New Name');
  });

  it('updates the description to null when explicitly set', async () => {
    const project = buildProject({ description: 'Old desc' });
    repo.seed(project);

    const result = await useCase.execute(project.id, { description: null });

    expect(result.description).toBeNull();
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute('non-existent-id', { name: 'X' })).rejects.toThrow(
      ProjectNotFoundError,
    );
  });
});
