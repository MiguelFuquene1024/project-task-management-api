import type { Task } from '../../domain/Task';
import type { ProjectWithStats } from '../../../projects/domain/Project';

export function buildTask(overrides: Partial<Task> = {}): Task {
  const base: Task = {
    id: crypto.randomUUID(),
    projectId: crypto.randomUUID(),
    title: 'Test Task',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...base, ...overrides } as Task;
}

export function buildProject(overrides: Partial<ProjectWithStats> = {}): ProjectWithStats {
  return {
    id: crypto.randomUUID(),
    name: 'Test Project',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    taskCount: 0,
    tasksByStatus: { TODO: 0, IN_PROGRESS: 0, BLOCKED: 0, IN_REVIEW: 0, DONE: 0 },
    ...overrides,
  };
}
