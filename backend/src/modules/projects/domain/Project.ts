export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithStats extends Project {
  taskCount: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    BLOCKED: number;
    IN_REVIEW: number;
    DONE: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string | null;
}

export interface UpdateProjectData {
  name?: string;
  description?: string | null;
}
