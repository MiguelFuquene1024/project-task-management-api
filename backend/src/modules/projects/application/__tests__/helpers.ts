import type { ProjectWithStats } from '../../domain/Project';

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
