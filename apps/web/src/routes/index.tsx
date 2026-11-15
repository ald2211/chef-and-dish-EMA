import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });

function HomePage() {
  return <main><h1>Chef & Dish</h1><p>Event operations foundation is ready.</p></main>;
}
