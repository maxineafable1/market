import { Link, useNavigate } from "@tanstack/react-router"
import { useUserContext } from "../contexts/UserContext"
import { useMutation } from "@tanstack/react-query"
import { signup } from "../utilities/fetch"
import { useEffect } from "react"

export default function Signup() {
  const navigate = useNavigate()
  const { setTokens } = useUserContext()

  const { mutate, isSuccess, isError, error, data } = useMutation({
    mutationFn: (formData: FormData) => signup(formData)
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('phone', e.currentTarget.phone.value)
    formData.append('email', e.currentTarget.email.value)
    formData.append('password', e.currentTarget.password.value)
    mutate(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      setTokens(data)
      localStorage.setItem('tokens', JSON.stringify(data))
      navigate({ to: '/', search: { page: 1, items: 10 } })
    }
  }, [isSuccess])

  return (
    <section className="max-w-xl mx-auto min-h-full grid">
      <div className="place-self-center w-full">
        <h2 className="text-xl mb-4">Create an account</h2>
        <form
          onSubmit={handleSubmit}
          className="grid gap-2"
        >
          <div className="grid">
            <label htmlFor="phone">Phone number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="px-3 py-1 rounded"
            />
          </div>
          <div className="grid">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              id="email"
              name="email"
              className="px-3 py-1 rounded"
            />
          </div>
          <div className="grid">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="px-3 py-1 rounded"
            />
          </div>
          <button className="bg-green-400 hover:bg-green-500 text-white rounded py-1 my-4">Sign up</button>
        </form>
        <p className="text-center text-sm">Already have an account? <Link to='/login' className="text-blue-400 hover:text-blue-500">Sign in</Link></p>
        {isError && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    </section>
  )
}
