export const openApiDocument = {
  openapi: '3.1.0',
  info: { title: 'Chef & Dish API', version: '0.1.0', description: 'API contract; business endpoints will be added in their planned phases.' },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/me': { get: { summary: 'Get the authenticated Clerk identity', security: [{ bearerAuth: [] }], responses: {
      '200': { description: 'Authenticated identity returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdentityResponse' } } } },
      '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    } } },
    '/health/live': { get: { summary: 'Liveness probe', responses: { '200': { description: 'Process is alive' } } } },
    '/health/ready': { get: { summary: 'Readiness probe', responses: { '200': { description: 'Dependencies ready' }, '503': { description: 'Dependencies unavailable' } } } }
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      IdentityResponse: { type: 'object', required: ['data'], properties: { data: { type: 'object', required: ['clerkUserId'], properties: { clerkUserId: { type: 'string' } } } } },
      ErrorEnvelope: { type: 'object', required: ['error'], properties: { error: { type: 'object', required: ['code', 'message', 'requestId'], properties: { code: { type: 'string' }, message: { type: 'string' }, requestId: { type: 'string' } } } } }
    }
  }
} as const;
