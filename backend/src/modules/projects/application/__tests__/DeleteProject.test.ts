import { InMemoryProjectRepository } from '../__fakes__/InMemoryProjectRepository';
import { DeleteProject } from '../DeleteProject';
import { ProjectNotFoundError } from '../../domain/errors/ProjectNotFoundError';
import { buildProject } from './helpers';

let repo: InMemoryProjectRepository;
let useCase: DeleteProject;

beforeEach(() => {
  repo = new InMemoryProjectRepository();
  useCase = new DeleteProject(repo);
});

describe('DeleteProject', () => {
  it('deletes an existing project', async () => {
    const project = buildProject();
    repo.seed(project);

    await useCase.execute(project.id);

    const found = await repo.findById(project.id);
    expect(found).toBeNull();
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
