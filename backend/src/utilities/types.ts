type PayloadType = {
  id: string
}

type PostType = 'vehicle' | 'item'

type CreatePost = {
  title: string
  price: number
  description: string
  type: PostType
  condition: 'new' | 'used'
}

type ValidatedPost = CreatePost & {
  fileNames: string[]
  userId: string
}

type ValidatedUpdatePost = ValidatedPost & {
  postId: number
  currentImages: string
}

type Color = 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'black' | 'white' | 'silver'

type VehiclePost = {
  make: string
  model: string
  year: number
  extColor: Color
  vehicleCondition: 'excellent' | 'good' | 'okay' 
  mileage: number
  bodyStyle: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'van' | 'mpv' | 'auv' | 'crossover'
  intColor: Color 
  fuelType: 'gasoline' | 'diesel' 
  transmission: 'automatic' | 'manual' | 'cvt'
  cleanTitle: boolean
}

export {
  PayloadType,
  PostType,
  CreatePost,
  VehiclePost,
  ValidatedPost,
  ValidatedUpdatePost,
}