import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { InMemoryProjectRepository } from '../../../projects/application/__fakes__/InMemoryProjectRepository';
import { ListTasksByProject } from '../ListTasksByProject';
import { ProjectNotFoundError } from '../../../projects/domain/errors/ProjectNotFoundError';
import { buildTask, buildProject } from './helpers';

let taskRepo: InMemoryTaskRepository;
let projectRepo: InMemoryProjectRepository;
let useCase: ListTasksByProject;

beforeEach(() => {
  taskRepo = new InMemoryTaskRepository();
  projectRepo = new InMemoryProjectRepository();
  useCase = new ListTasksByProject(taskRepo, projectRepo);
});

describe('ListTasksByProject', () => {
  it('returns all tasks for the given project', async () => {
    const project = buildProject();
    projectRepo.seed(project);
    taskRepo.seed(buildTask({ projectId: project.id, title: 'Task A' }));
    taskRepo.seed(buildTask({ projectId: project.id, title: 'Task B' }));

    const result = await useCase.execute(project.id);

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.title)).toEqual(expect.arrayContaining(['Task A', 'Task B']));
  });

  it('returns empty array when project has no tasks', async () => {
    const project = buildProject();
    projectRepo.seed(project);

    const result = await useCase.execute(project.id);

    expect(result).toEqual([]);
  });

  it('does not return tasks from other projects', async () => {
    const project = buildProject();
    const other = buildProject();
    projectRepo.seed(project);
    projectRepo.seed(other);
    taskRepo.seed(buildTask({ projectId: other.id, title: 'Other task' }));

    const result = await useCase.execute(project.id);

    expect(result).toHaveLength(0);
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(ProjectNotFoundError);
  });
});
