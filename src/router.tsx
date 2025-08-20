import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  useSearch,
  Navigate,
} from "@tanstack/react-router";
import { z } from "zod";
import CharactersList from "./components/CharactersList";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-4 text-red-500">⚠️ Page not found</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-4 text-red-500">⚠️ Error: {error.message}</div>
  ),
});

//  /characters list
const charactersRoute = createRoute({
  getParentRoute: () => charactersParentRoute,
  path: "/",
  validateSearch: z.object({
    page: z.number().optional(),
  }),
  component: CharactersListWrapper,
});

function CharactersListWrapper() {
  const search = useSearch({ from: charactersRoute.id });
  const page = search.page ?? 1;
  return <CharactersList page={page} />;
}


//  Parent /characters
export const charactersParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/characters",
  component: () => <Outlet />,
});

//  Home redirect (/ → /characters)
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/characters" />,
});

// Build route tree
export const routeTree = rootRoute.addChildren([
  homeRoute,
  charactersParentRoute.addChildren([charactersRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="p-4 text-red-500"> Page not found</div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
