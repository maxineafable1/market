import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useUserContext } from "../contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { logout } from "../utilities/fetch";

export default function RootComponent() {
  const { tokens, setTokens } = useUserContext()

  const { mutate, isSuccess, isError, error } = useMutation({
    mutationFn: () => logout(tokens?.refresh!)
  })

  useEffect(() => {
    if (isSuccess) {
      setTokens(null)
      localStorage.removeItem('tokens')
    }
  }, [isSuccess])

  return (
    <>
      <nav className="bg-white">
        <div className="max-w-screen-xl mx-auto p-4 flex items-center">
          <Link
            to="/"
            className="[&.active]:font-bold mr-auto text-xl"
            search={{ page: 1, items: 10 }}
          >
            Marketplace
          </Link>
          {tokens ? (
            <button onClick={() => mutate()}>Logout</button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="[&.active]:font-bold">
                Login
              </Link>
              <Link to="/login" className="[&.active]:font-bold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        {isError && <p className="text-red-500">{error.message}</p>}
      </nav>
      <main className="bg-white my-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}