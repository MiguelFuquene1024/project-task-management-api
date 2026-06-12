import { api } from '../../../shared/lib/api';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../../../shared/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const tasksApi = {
  listByProject: (projectId: string): Promise<Task[]> =>
    api
      .get<ApiResponse<Task[]>>(`/api/projects/${projectId}/tasks`)
      .then((r) => r.data.data),

  findById: (id: string): Promise<Task> =>
    api.get<ApiResponse<Task>>(`/api/tasks/${id}`).then((r) => r.data.data),

  create: (projectId: string, data: CreateTaskInput): Promise<Task> =>
    api
      .post<ApiResponse<Task>>(`/api/projects/${projectId}/tasks`, data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateTaskInput): Promise<Task> =>
    api.put<ApiResponse<Task>>(`/api/tasks/${id}`, data).then((r) => r.data.data),

  updateStatus: (id: string, status: TaskStatus): Promise<Task> =>
    api
      .patch<ApiResponse<Task>>(`/api/tasks/${id}/status`, { status })
      .then((r) => r.data.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/api/tasks/${id}`).then(() => undefined),
};
