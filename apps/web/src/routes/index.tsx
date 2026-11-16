import { createRoute } from '@tanstack/react-router';
import { SignInButton, UserButton, useAuth } from '@clerk/react';
import { Route as rootRoute } from './__root';

export const Route = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });

function HomePage() {
  const { isLoaded, isSignedIn } = useAuth();

  return <main><h1>Chef & Dish</h1><p>Event operations foundation is ready.</p>
    {!isLoaded ? <p>Loading account…</p> : isSignedIn ? <><p>Signed in with Clerk.</p><UserButton /></> : <SignInButton mode="modal"><button type="button">Sign in</button></SignInButton>}
  </main>;
}
