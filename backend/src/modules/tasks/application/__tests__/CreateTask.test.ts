import { InMemoryTaskRepository } from '../__fakes__/InMemoryTaskRepository';
import { InMemoryProjectRepository } from '../../../projects/application/__fakes__/InMemoryProjectRepository';
import { CreateTask } from '../CreateTask';
import { ProjectNotFoundError } from '../../../projects/domain/errors/ProjectNotFoundError';
import { buildProject } from './helpers';

let taskRepo: InMemoryTaskRepository;
let projectRepo: InMemoryProjectRepository;
let useCase: CreateTask;

beforeEach(() => {
  taskRepo = new InMemoryTaskRepository();
  projectRepo = new InMemoryProjectRepository();
  useCase = new CreateTask(taskRepo, projectRepo);
});

describe('CreateTask', () => {
  it('creates a task under an existing project', async () => {
    const project = buildProject();
    projectRepo.seed(project);

    const result = await useCase.execute({
      projectId: project.id,
      title: 'Fix bug',
    });

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Fix bug');
    expect(result.projectId).toBe(project.id);
  });

  it('defaults status to TODO and priority to MEDIUM', async () => {
    const project = buildProject();
    projectRepo.seed(project);

    const result = await useCase.execute({ projectId: project.id, title: 'Task' });

    expect(result.status).toBe('TODO');
    expect(result.priority).toBe('MEDIUM');
  });

  it('respects explicit status and priority', async () => {
    const project = buildProject();
    projectRepo.seed(project);

    const result = await useCase.execute({
      projectId: project.id,
      title: 'Urgent task',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    });

    expect(result.status).toBe('IN_PROGRESS');
    expect(result.priority).toBe('HIGH');
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(
      useCase.execute({ projectId: 'non-existent-id', title: 'Task' }),
    ).rejects.toThrow(ProjectNotFoundError);
  });
});
