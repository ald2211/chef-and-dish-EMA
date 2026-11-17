export const openApiDocument = {
  openapi: '3.1.0',
  info: { title: 'Chef & Dish API', version: '0.1.0', description: 'API contract; business endpoints will be added in their planned phases.' },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/me': { get: { summary: 'Get the authenticated Clerk identity', security: [{ bearerAuth: [] }], responses: {
      '200': { description: 'Authenticated identity returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdentityResponse' } } } },
      '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '403': { description: 'Authenticated account is not provisioned or is inactive', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    } } },
    '/drivers': { post: { summary: 'Provision a Clerk account as a driver', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProvisionDriverRequest' } } } }, responses: {
      '201': { description: 'Driver account provisioned', content: { 'application/json': { schema: { $ref: '#/components/schemas/DriverResponse' } } } },
      '400': { description: 'Request validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '403': { description: 'Account is not provisioned, inactive, or is not an administrator', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '409': { description: 'Account already has a different role', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    } } },
    '/events': {
      get: { summary: 'List events accessible to the authenticated user', security: [{ bearerAuth: [] }], responses: {
        '200': { description: 'Accessible events', content: { 'application/json': { schema: { type: 'object', required: ['data'], properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } } } } },
        '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
        '403': { description: 'Account is not provisioned or is inactive', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
        '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
      } },
      post: { summary: 'Create an event (admin only)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEventRequest' } } } }, responses: {
        '201': { description: 'Event created', content: { 'application/json': { schema: { type: 'object', required: ['data'], properties: { data: { $ref: '#/components/schemas/Event' } } } } } },
        '400': { description: 'Request validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
        '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
        '403': { description: 'Account is not provisioned or is not an administrator', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
        '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
      } }
    },
    '/events/{eventId}': { get: { summary: 'Get an event if accessible to the authenticated user', security: [{ bearerAuth: [] }], parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } }], responses: {
      '200': { description: 'Event returned', content: { 'application/json': { schema: { type: 'object', required: ['data'], properties: { data: { $ref: '#/components/schemas/Event' } } } } } },
      '400': { description: 'Invalid event ID', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '403': { description: 'Account is not provisioned or is inactive', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '404': { description: 'Event not found or not assigned to this driver', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    } } },
    '/events/{eventId}/drivers': { post: { summary: 'Assign a provisioned driver to an event (admin only)', security: [{ bearerAuth: [] }], parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProvisionDriverRequest' } } } }, responses: {
      '204': { description: 'Driver assigned' },
      '400': { description: 'Request validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '401': { description: 'Authentication is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '403': { description: 'Account is not provisioned or is not an administrator', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '404': { description: 'Event not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '422': { description: 'Selected account is not an active driver', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } },
      '503': { description: 'Authentication is not configured', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } } } }
    } } },
    '/health/live': { get: { summary: 'Liveness probe', responses: { '200': { description: 'Process is alive' } } } },
    '/health/ready': { get: { summary: 'Readiness probe', responses: { '200': { description: 'Dependencies ready' }, '503': { description: 'Dependencies unavailable' } } } }
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      IdentityResponse: { type: 'object', required: ['data'], properties: { data: { type: 'object', required: ['clerkUserId', 'role'], properties: { clerkUserId: { type: 'string' }, role: { type: 'string', enum: ['ADMIN', 'DRIVER'] } } } } },
      ProvisionDriverRequest: { type: 'object', additionalProperties: false, required: ['clerkUserId'], properties: { clerkUserId: { type: 'string', pattern: '^user_[A-Za-z0-9]+$' } } },
      DriverResponse: { type: 'object', required: ['data'], properties: { data: { type: 'object', required: ['clerkUserId', 'role'], properties: { clerkUserId: { type: 'string' }, role: { type: 'string', const: 'DRIVER' } } } } },
      CreateEventRequest: { type: 'object', additionalProperties: false, required: ['name', 'startsAt', 'location'], properties: { name: { type: 'string', minLength: 1, maxLength: 160 }, startsAt: { type: 'string', format: 'date-time' }, location: { type: 'string', minLength: 1, maxLength: 240 } } },
      Event: { type: 'object', required: ['id', 'name', 'startsAt', 'location', 'assignedDriverClerkUserIds'], properties: { id: { type: 'string' }, name: { type: 'string' }, startsAt: { type: 'string', format: 'date-time' }, location: { type: 'string' }, assignedDriverClerkUserIds: { type: 'array', items: { type: 'string' } } } },
      ErrorEnvelope: { type: 'object', required: ['error'], properties: { error: { type: 'object', required: ['code', 'message', 'requestId'], properties: { code: { type: 'string' }, message: { type: 'string' }, requestId: { type: 'string' } } } } }
    }
  }
} as const;
