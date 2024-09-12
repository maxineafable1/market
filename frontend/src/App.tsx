import { createRootRouteWithContext, createRoute, createRouter, Link, redirect, RouterProvider } from "@tanstack/react-router"
import RootComponent from "./components/RootComponent"
import Home from "./pages/Home"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Login from "./pages/Login"
import { getPost, getPosts } from "./utilities/fetch"
import { UserContextReturn, useUserContext } from "./contexts/UserContext"
import PostDetail from "./pages/PostDetail"

const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient,
  user: UserContextReturn
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/" search={{ page: 1, items: 10 }}>Go back to home</Link>
      </div>
    )
  },
})

type PostsSearch = {
  page: number
  items: number
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
  validateSearch: (search: Record<string, unknown>): PostsSearch => {
    return {
      page: +(search?.page ?? 1),
      items: +(search?.items ?? 10),
    }
  },
  loaderDeps: ({ search: { page, items } }) => ({ page, items }),
  loader: async ({ context: { queryClient }, deps: { page, items } }) => {
    queryClient.ensureQueryData(getPosts(page, items))
  }
})

type PostFilter = {
  type: 'vehicles' | 'items'
}

export const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'item/$postId',
  component: PostDetail, 
  validateSearch: (search: Record<string, unknown>): PostFilter => {
    return {
      type: search.type as 'vehicles' | 'items'
    }
  },
  loaderDeps: ({ search: { type } }): PostFilter => ({ type }),
  loader: ({ context: { queryClient }, params: { postId }, deps: { type } }) => {
    queryClient.ensureQueryData(getPost(postId, type))
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
  beforeLoad: ({ context: { user } }) => {
    const { tokens } = user
    if (tokens) {
      throw redirect({
        to: '/',
        search: { page: 1, items: 10 }
      })
    }
  }
})

const queryClient = new QueryClient()

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  postDetailRoute,
  // postsRoute.addChildren([
  //   postDetailRoute,
  // ]),
])

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
    user: undefined!,
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  const user = useUserContext()

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ user }} />
    </QueryClientProvider>
  )
}
