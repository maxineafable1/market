import { useSuspenseQuery } from "@tanstack/react-query"
import { useUserContext } from "../contexts/UserContext"
import { getUserInfo, getUserPosts } from "../utilities/fetch"
import { PostType } from "../utilities/types"
import Post from "../components/Post"
import { dashboardRoute } from "../App"
import { useEffect } from "react"
import { jwtDecode } from "jwt-decode"

type UserInfoType = {
  email: string
  first_name: string
  last_name: string
  phone: string
  image: string
  user_id: string
}

export default function Dashboard() {
  const { tokens } = useUserContext()
  const { userId } = dashboardRoute.useParams()

  const dataUser = useSuspenseQuery(getUserInfo(userId))
  const dataPosts = useSuspenseQuery(getUserPosts(userId))

  const user: UserInfoType = dataUser.data
  const posts: PostType[] = dataPosts.data

  useEffect(() => {
    dataUser.refetch()
    dataPosts.refetch()
  }, [userId])

  return (
    <div className="py-4">
      <div className="flex items-center gap-4">
        <img
          src={`http://localhost:4000/${user.image}`}
          alt=""
          className="max-w-40 rounded-full aspect-square border border-black"
        />
        <p className="text-xl">First Name LastName</p>
      </div>
      <div className="mt-8">
        {posts.length === 0 ? (
          <p>You have no items listed</p>
        ) : (
          <>
            <h2 className="font-semibold text-xl mb-4">Your items</h2>
            <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2">
              {posts.map((post: PostType) => (
                <Post key={post.post_id} post={post} dashboard />
              ))}
            </ul>
          </>
        )}
      </div >
    </div >
  )
}
