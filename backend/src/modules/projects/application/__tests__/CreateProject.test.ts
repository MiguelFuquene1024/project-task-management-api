import { InMemoryProjectRepository } from '../__fakes__/InMemoryProjectRepository';
import { CreateProject } from '../CreateProject';

let repo: InMemoryProjectRepository;
let useCase: CreateProject;

beforeEach(() => {
  repo = new InMemoryProjectRepository();
  useCase = new CreateProject(repo);
});

describe('CreateProject', () => {
  it('creates and returns a project with the given name', async () => {
    const result = await useCase.execute({ name: 'New Project' });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('New Project');
    expect(result.description).toBeNull();
  });

  it('creates a project with an optional description', async () => {
    const result = await useCase.execute({ name: 'With Desc', description: 'A description' });

    expect(result.description).toBe('A description');
  });

  it('persists the project so it can be found afterwards', async () => {
    const created = await useCase.execute({ name: 'Persisted' });
    const found = await repo.findById(created.id);

    expect(found).not.toBeNull();
    expect(found!.name).toBe('Persisted');
  });
});
