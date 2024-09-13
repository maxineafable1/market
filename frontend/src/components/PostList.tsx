import { useSuspenseQuery } from "@tanstack/react-query";
import Post from "./Post";
import { PostType } from "../utilities/types";
import { getPosts } from "../utilities/fetch";
import { indexRoute } from "../App";


export default function PostList() {
  const { page, items } = indexRoute.useSearch()
  const { data } = useSuspenseQuery(getPosts(page, items))

  return (
    <ul className="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-2">
      {data.map((post: PostType) => (
        <Post key={post.post_id} post={post} dashboard={false} />
      ))}
    </ul>
  )
}
