import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';
import './styles.css';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) Sentry.init({ dsn: sentryDsn, environment: import.meta.env.MODE, sendDefaultPii: false, tracesSampleRate: import.meta.env.PROD ? 0.1 : 0 });

const queryClient = new QueryClient();
const router = createRouter({ routeTree, context: { queryClient } });
declare module '@tanstack/react-router' { interface Register { router: typeof router } }

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider></React.StrictMode>
);
