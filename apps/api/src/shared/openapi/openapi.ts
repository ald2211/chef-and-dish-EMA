export const openApiDocument = {
  openapi: '3.1.0',
  info: { title: 'Chef & Dish API', version: '0.1.0', description: 'API contract; business endpoints will be added in their planned phases.' },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/health/live': { get: { summary: 'Liveness probe', responses: { '200': { description: 'Process is alive' } } } },
    '/health/ready': { get: { summary: 'Readiness probe', responses: { '200': { description: 'Dependencies ready' }, '503': { description: 'Dependencies unavailable' } } } }
  }
} as const;
