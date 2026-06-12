import { api } from '../../../shared/lib/api';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../../../shared/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const projectsApi = {
  list: (): Promise<Project[]> =>
    api.get<ApiResponse<Project[]>>('/api/projects').then((r) => r.data.data),

  findById: (id: string): Promise<Project> =>
    api.get<ApiResponse<Project>>(`/api/projects/${id}`).then((r) => r.data.data),

  create: (data: CreateProjectInput): Promise<Project> =>
    api.post<ApiResponse<Project>>('/api/projects', data).then((r) => r.data.data),

  update: (id: string, data: UpdateProjectInput): Promise<Project> =>
    api.put<ApiResponse<Project>>(`/api/projects/${id}`, data).then((r) => r.data.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/api/projects/${id}`).then(() => undefined),
};
