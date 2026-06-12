import { InMemoryProjectRepository } from '../__fakes__/InMemoryProjectRepository';
import { ListProjects } from '../ListProjects';
import { buildProject } from './helpers';

let repo: InMemoryProjectRepository;
let useCase: ListProjects;

beforeEach(() => {
  repo = new InMemoryProjectRepository();
  useCase = new ListProjects(repo);
});

describe('ListProjects', () => {
  it('returns an empty array when there are no projects', async () => {
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('returns all seeded projects', async () => {
    repo.seed(buildProject({ name: 'Alpha' }));
    repo.seed(buildProject({ name: 'Beta' }));

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(expect.arrayContaining(['Alpha', 'Beta']));
  });
});
