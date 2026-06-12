import { InMemoryProjectRepository } from '../__fakes__/InMemoryProjectRepository';
import { FindProjectById } from '../FindProjectById';
import { ProjectNotFoundError } from '../../domain/errors/ProjectNotFoundError';
import { buildProject } from './helpers';

let repo: InMemoryProjectRepository;
let useCase: FindProjectById;

beforeEach(() => {
  repo = new InMemoryProjectRepository();
  useCase = new FindProjectById(repo);
});

describe('FindProjectById', () => {
  it('returns the project when it exists', async () => {
    const project = buildProject({ name: 'My Project' });
    repo.seed(project);

    const result = await useCase.execute(project.id);

    expect(result.id).toBe(project.id);
    expect(result.name).toBe('My Project');
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(ProjectNotFoundError);
  });

  it('thrown error carries correct errorCode', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toMatchObject({
      errorCode: 'PROJECT_NOT_FOUND',
    });
  });
});
