import { Router } from 'express';
import { container } from '../../../container/register.js';

export const healthRouter = Router();
healthRouter.get('/live', (_request, response) => response.status(200).json({ status: 'ok' }));
healthRouter.get('/ready', (_request, response) => {
  const ready = container.resolve<() => boolean>('databaseReady')();
  response.status(ready ? 200 : 503).json({ status: ready ? 'ok' : 'unavailable' });
});
