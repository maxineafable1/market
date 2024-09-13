import { Link } from "@tanstack/react-router"
import { PostType } from "../utilities/types"
import { currencyPhpFormat, splitImages } from "../utilities/functions"
import { useUserContext } from "../contexts/UserContext"
import { jwtDecode } from "jwt-decode"
import { JwtDecodePayloadType } from "./RootComponent"

// type PostPropsExtend = {
//   dashboard: true
//   currentUserId?: never
// } | {
//   dashboard: false
//   currentUserId?: never
// }

type PostProps = {
  post: PostType
  dashboard: boolean
}

export default function Post({ post, dashboard }: PostProps) {
  const { tokens } = useUserContext()

  const imageLists = splitImages(post.images)

  return (
    <Link
      to="/item/$postId"
      params={{ postId: String(post.post_id) }}
      search={{ type: post.type }}
      className={`${dashboard ? 'rounded hover:shadow overflow-hidden' : 'card-post-hover'}`}
    >
      <img
        src={`http://localhost:4000/${imageLists[0]}`}
        alt=""
        className={`${!dashboard && 'rounded-lg'} aspect-square object-cover w-full`}
      />
      <div className={`p-2 ${dashboard && 'bg-white'}`}>
        <h2 className="font-bold">{post.title}</h2>
        <p>{currencyPhpFormat(+post.price)}</p>
        <p>{post.condition}</p>
        {(dashboard && (tokens && jwtDecode<JwtDecodePayloadType>(tokens?.access).id === post.user_id)) && (
          <div className="flex items-center text-white text-sm gap-1 mt-2">
            <button className="bg-yellow-500 px-2 rounded hover:bg-yellow-600">Edit</button>
            <button className="bg-red-500 px-2 rounded hover:bg-red-600">Remove</button>
          </div>
        )}
      </div>
    </Link>
  )
}
