import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'REST API for managing projects and tasks on a Kanban board',
    },
    servers: [{ url: '/api' }],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            taskCount: { type: 'integer' },
            tasksByStatus: {
              type: 'object',
              properties: {
                TODO: { type: 'integer' },
                IN_PROGRESS: { type: 'integer' },
                DONE: { type: 'integer' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            projectId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errorCode: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/infrastructure/*Routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
