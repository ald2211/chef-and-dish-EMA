import { describe, expect, it } from 'vitest';
import { openApiDocument } from './openapi.js';

describe('OpenAPI contract', () => {
  it('uses OpenAPI 3.1 and documents health probes', () => {
    expect(openApiDocument.openapi).toBe('3.1.0');
    expect(openApiDocument.paths['/health/live']?.get.responses['200']).toBeDefined();
    expect(openApiDocument.paths['/health/ready']?.get.responses['503']).toBeDefined();
  });
});
