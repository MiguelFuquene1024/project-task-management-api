export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date | null;
}
