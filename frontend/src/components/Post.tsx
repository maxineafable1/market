import { Link } from "@tanstack/react-router"
import { PostType } from "../utilities/types"
import { currencyPhpFormat, splitImages } from "../utilities/functions"

type PostProps = PostType

export default function Post({ title, images, price, type, condition, post_id }: PostProps) {

  const imageLists = splitImages(images)

  return (
    <Link
      to="/item/$postId"
      params={{ postId: String(post_id) }}
      search={{ type }}
      className=""
    >
      <img
        src={`http://localhost:4000/${imageLists[0]}`}
        alt=""
        className="rounded-lg aspect-square object-cover w-full"
      />
      <div className="py-2">
        <h2 className="font-bold">{title}</h2>
        <p>{currencyPhpFormat(+price)}</p>
        <p>{condition}</p>
      </div>
    </Link>
  )
}
