import SwaggerParser from '@apidevtools/swagger-parser';
import { openApiDocument } from '../src/shared/openapi/openapi.js';

await SwaggerParser.validate(structuredClone(openApiDocument));
console.info('OpenAPI contract is valid.');
