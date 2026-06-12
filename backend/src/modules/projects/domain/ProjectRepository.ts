import { Project, ProjectWithStats, CreateProjectData, UpdateProjectData } from './Project';

export interface ProjectRepository {
  findAll(): Promise<ProjectWithStats[]>;
  findById(id: string): Promise<ProjectWithStats | null>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: string, data: UpdateProjectData): Promise<Project>;
  delete(id: string): Promise<void>;
}
