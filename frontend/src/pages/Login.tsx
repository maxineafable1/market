// import { useMutation } from "@tanstack/react-query"
// import { login } from "../utilities/fetch"
import { useNavigate } from "@tanstack/react-router"
import { useUserContext } from "../contexts/UserContext"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { login } from "../utilities/fetch"

export default function Login() {
  const navigate = useNavigate()
  const { setTokens } = useUserContext()

  const { mutate, isSuccess, isError, error, data } = useMutation({
    mutationFn: (formData: FormData) => login(formData)
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('phoneOrEmail', e.currentTarget.phoneOrEmail.value)
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phoneOrEmail">Phone or Email</label>
        <input type="text" id="phoneOrEmail" name="phoneOrEmail" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <button>login</button>
      </form>
      {isError && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
