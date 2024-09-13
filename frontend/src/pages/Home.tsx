import PostList from "../components/PostList"

export default function Home() {
  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Today's picks</h1>
      <PostList />
    </section>
  )
}