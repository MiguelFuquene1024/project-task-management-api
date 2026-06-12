import request from 'supertest';
import express from 'express';
import { createProjectRouter } from '../ProjectRoutes';
import { InMemoryProjectRepository } from '../../application/__fakes__/InMemoryProjectRepository';
import { errorHandler } from '../../../../shared/middleware/errorHandler';
import { buildProject } from '../../application/__tests__/helpers';

function buildApp(repo: InMemoryProjectRepository) {
  const app = express();
  app.use(express.json());
  app.use('/api', createProjectRouter(repo));
  app.use(errorHandler);
  return app;
}

describe('Projects API', () => {
  let repo: InMemoryProjectRepository;
  let app: express.Express;

  beforeEach(() => {
    repo = new InMemoryProjectRepository();
    app = buildApp(repo);
  });

  describe('GET /api/projects', () => {
    it('should return empty list when no projects exist', async () => {
      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return all projects', async () => {
      repo.seed(buildProject({ name: 'Alpha' }));
      repo.seed(buildProject({ name: 'Beta' }));

      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return the project when found', async () => {
      const project = buildProject({ name: 'My Project' });
      repo.seed(project);

      const res = await request(app).get(`/api/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(project.id);
      expect(res.body.data.name).toBe('My Project');
    });

    it('should return 404 when project does not exist', async () => {
      const res = await request(app).get('/api/projects/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('PROJECT_NOT_FOUND');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a project and return 201', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ name: 'New Project', description: 'A description' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('New Project');
      expect(res.body.data.description).toBe('A description');
      expect(res.body.data.id).toBeDefined();
    });

    it('should return 422 when name is missing', async () => {
      const res = await request(app).post('/api/projects').send({ description: 'No name' });

      expect(res.status).toBe(422);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 422 when name exceeds max length', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ name: 'A'.repeat(101) });

      expect(res.status).toBe(422);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project name', async () => {
      const project = buildProject({ name: 'Old Name' });
      repo.seed(project);

      const res = await request(app)
        .put(`/api/projects/${project.id}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('New Name');
    });

    it('should return 404 when updating non-existent project', async () => {
      const res = await request(app)
        .put('/api/projects/non-existent-id')
        .send({ name: 'New Name' });

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('PROJECT_NOT_FOUND');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project and return 204', async () => {
      const project = buildProject();
      repo.seed(project);

      const res = await request(app).delete(`/api/projects/${project.id}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting non-existent project', async () => {
      const res = await request(app).delete('/api/projects/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.errorCode).toBe('PROJECT_NOT_FOUND');
    });
  });
});
