import request from 'supertest';
import express from 'express';
import { createTaskRouter } from '../TaskRoutes';
import { InMemoryTaskRepository } from '../../application/__fakes__/InMemoryTaskRepository';
import { InMemoryProjectRepository } from '../../../projects/application/__fakes__/InMemoryProjectRepository';
import { errorHandler } from '../../../../shared/middleware/errorHandler';
import { buildTask, buildProject } from '../../application/__tests__/helpers';

function buildApp(taskRepo: InMemoryTaskRepository, projectRepo: InMemoryProjectRepository) {
  const app = express();
  app.use(express.json());
  app.use('/api', createTaskRouter(taskRepo, projectRepo));
  app.use(errorHandler);
  return app;
}

describe('Tasks API', () => {
  let taskRepo: InMemoryTaskRepository;
  let projectRepo: InMemoryProjectRepository;
  let app: express.Express;

  beforeEach(() => {
    taskRepo = new InMemoryTaskRepository();
    projectRepo = new InMemoryProjectRepository();
    app = buildApp(taskRepo, projectRepo);
  });

  describe('GET /api/projects/:projectId/tasks', () => {
    it('should return tasks for the project', async () => {
      const project = buildProject();
      projectRepo.seed(project);
      taskRepo.seed(buildTask({ projectId: project.id, title: 'Task A' }));
      taskRepo.seed(buildTask({ projectId: project.id, title: 'Task B' }));

      const res = await request(app).get(`/api/projects/${project.id}/tasks`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return 404 when project does not exist', async () => {
      const res = await request(app).get('/api/projects/non-existent/tasks');

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('PROJECT_NOT_FOUND');
    });

    it('should return empty list when project has no tasks', async () => {
      const project = buildProject();
      projectRepo.seed(project);

      const res = await request(app).get(`/api/projects/${project.id}/tasks`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('POST /api/projects/:projectId/tasks', () => {
    it('should create a task with default status TODO', async () => {
      const project = buildProject();
      projectRepo.seed(project);

      const res = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .send({ title: 'New Task', priority: 'HIGH' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('New Task');
      expect(res.body.data.status).toBe('TODO');
      expect(res.body.data.priority).toBe('HIGH');
    });

    it('should create a task with BLOCKED status', async () => {
      const project = buildProject();
      projectRepo.seed(project);

      const res = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .send({ title: 'Blocked Task', status: 'BLOCKED' });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('BLOCKED');
    });

    it('should create a task with IN_REVIEW status', async () => {
      const project = buildProject();
      projectRepo.seed(project);

      const res = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .send({ title: 'Review Task', status: 'IN_REVIEW' });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('IN_REVIEW');
    });

    it('should return 422 when title is missing', async () => {
      const project = buildProject();
      projectRepo.seed(project);

      const res = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .send({ priority: 'LOW' });

      expect(res.status).toBe(422);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 404 when project does not exist', async () => {
      const res = await request(app)
        .post('/api/projects/non-existent/tasks')
        .send({ title: 'Orphan Task' });

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('PROJECT_NOT_FOUND');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return the task when found', async () => {
      const task = buildTask({ title: 'My Task' });
      taskRepo.seed(task);

      const res = await request(app).get(`/api/tasks/${task.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(task.id);
      expect(res.body.data.title).toBe('My Task');
    });

    it('should return 404 when task does not exist', async () => {
      const res = await request(app).get('/api/tasks/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('TASK_NOT_FOUND');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const task = buildTask({ status: 'TODO' });
      taskRepo.seed(task);

      const res = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'IN_PROGRESS' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should update status to BLOCKED', async () => {
      const task = buildTask({ status: 'IN_PROGRESS' });
      taskRepo.seed(task);

      const res = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'BLOCKED' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('BLOCKED');
    });

    it('should return 422 for invalid status value', async () => {
      const task = buildTask();
      taskRepo.seed(task);

      const res = await request(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: 'INVALID_STATUS' });

      expect(res.status).toBe(422);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 404 when task does not exist', async () => {
      const res = await request(app)
        .patch('/api/tasks/non-existent-id/status')
        .send({ status: 'DONE' });

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('TASK_NOT_FOUND');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task and return 204', async () => {
      const task = buildTask();
      taskRepo.seed(task);

      const res = await request(app).delete(`/api/tasks/${task.id}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('TASK_NOT_FOUND');
    });
  });
});
