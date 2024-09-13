import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useUserContext } from "../contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { logout } from "../utilities/fetch";
import { jwtDecode } from "jwt-decode";
import { FaUser, FaStore, FaPlus, FaUserPlus } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";

export type JwtDecodePayloadType = {
  id: string
}

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
    <div className="md:grid grid-cols-4 max-w-screen-2xl mx-auto">
      <nav className="bg-white py-4 px-2 md:min-h-dvh shadow">
        <h1
          className="font-bold text-2xl"
        >
          Marketplace
        </h1>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search marketplace"
          className="my-4 bg-slate-100 px-3 py-0.5 w-full rounded-full"
        />
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            search={{ page: 1, items: 10 }}
            className="[&.active]:bg-slate-200 flex items-center p-1 gap-2 hover:bg-slate-300 rounded"
          >
            <FaStore className="bg-gray-200 p-2 rounded-full" fontSize='2rem' />
            Browse All
          </Link>
          {tokens ? (
            <>
              <Link
                key='profile'
                to="/profile/$userId"
                params={{ userId: jwtDecode<JwtDecodePayloadType>(tokens?.access).id }}
                className="[&.active]:bg-slate-200 flex items-center p-1 gap-2 hover:bg-slate-300 rounded"
              >
                <FaUser className="bg-gray-200 p-2 rounded-full" fontSize='2rem' />
                Profile
              </Link>
              <button
                onClick={() => mutate()}
                className="bg-sky-200 rounded mt-4 py-1 text-blue-600 hover:bg-sky-100 font-bold"
              >
                Logout
              </button>
              <Link
                to="/item/create"
                className="bg-sky-200 rounded mt-2 py-1 text-blue-600 hover:bg-sky-100 font-bold inline-flex items-center justify-center gap-2"
              >
                <FaPlus />
                Create new listing
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="[&.active]:bg-slate-200 flex items-center p-1 gap-2 hover:bg-slate-300 rounded"
              >
                <LuLogIn className="bg-gray-200 p-2 rounded-full" fontSize='2rem' />
                Login
              </Link>
              <Link
                to="/signup"
                className="[&.active]:bg-slate-200 flex items-center p-1 gap-2 hover:bg-slate-300 rounded"
              >
                <FaUserPlus className="bg-gray-200 p-2 rounded-full" fontSize='2rem' />
                Sign Up
              </Link>
            </>
          )}
        </div>
        {isError && <p className="text-red-500">{error.message}</p>}
      </nav>
      <main className="col-span-3 p-4">
        <Outlet />
      </main>
    </div>
    // <ReactQueryDevtools buttonPosition="bottom-left" />
    // <TanStackRouterDevtools position="bottom-right" />
  )
}