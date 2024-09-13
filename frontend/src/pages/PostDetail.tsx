import { useSuspenseQuery } from "@tanstack/react-query"
import { getPost } from "../utilities/fetch"
import { postDetailRoute } from "../App"
import { Link } from "@tanstack/react-router"
import { currencyPhpFormat, formattedDate } from "../utilities/functions"
import ImageSlider from "../components/ImageSlider"

type Color = 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'black' | 'white' | 'silver'

type VehicleDetailsType = {
  title: string
  price: string
  description: string
  make: string
  model: string
  year: string
  images: string
  exterior_color: Color
  condition: 'new' | 'used'
  vehicle_condition: 'excellent' | 'good' | 'okay'
  mileage: number
  body_style: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'van' | 'mpv' | 'auv' | 'crossover'
  interior_color: Color
  fuel_type: 'gasoline' | 'diesel'
  transmission: 'automatic' | 'manual' | 'cvt'
  clean_title: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export default function PostDetail() {
  const { postId } = postDetailRoute.useParams()
  const { type } = postDetailRoute.useSearch()
  const { data }: { data: VehicleDetailsType } = useSuspenseQuery(getPost(postId, type))

  console.log(data)

  return (
    <section>
      <ImageSlider images={data.images} />
      <div className="bg-white p-4 mt-4 rounded shadow">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">{data.title}</h2>
          <p className="text-lg">{currencyPhpFormat(+data.price)}</p>
          <p className="text-sm text-slate-500">Posted on: {formattedDate(data.created_at)}</p>
        </div>
        <div className="my-4 h-0.5 bg-slate-200"></div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-bold">Details</h2>
            <div className="flex items-center gap-20">
              <p>Condition</p>
              <p>{data.condition}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">About this vehicle</h2>
            <p>Make: {data.make}</p>
            <p>Model: {data.model}</p>
            <p>Year: {data.year}</p>
            <p>Driven {data.mileage}</p>
            <p>Body style: {data.body_style}</p>
            <div>
              <p>Exterior color: {data.exterior_color}</p>
              <p>Interior color: {data.interior_color}</p>
            </div>
            <p>Fuel type: {data.fuel_type}</p>
            <p>Condition: {data.vehicle_condition}</p>
          </div>
        </div>
        <div className="my-4 h-0.5 bg-slate-200"></div>
        <div>
          <h2 className="text-lg font-bold">Seller's description</h2>
          <p>{data.description}</p>
        </div>
        <div className="my-4 h-0.5 bg-slate-200"></div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Seller information</h2>
          <Link
            key='seller'
            to="/profile/$userId"
            params={{ userId: data.user_id }}
            className="text-blue-400 hover:text-blue-500"
          >
            Seller details
          </Link>
        </div>
        <p className="text-sm font-semibold">First Name LastName</p>
      </div>
    </section>
  )
}
