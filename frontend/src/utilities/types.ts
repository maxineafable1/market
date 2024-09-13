export type PostType = {
  post_id: number
  title: string
  description: string
  price: string
  type: 'vehicles' | 'items'
  condition: string
  images: string
  user_id: string
}