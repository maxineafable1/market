import item from '../../public/item.png'
import vehicle from '../../public/car.png'
import house from '../../public/house.png'
import { Link } from '@tanstack/react-router'

const postTypeCards = [
  {
    title: 'Item for sale',
    desc: 'Create a single listing for one or more items to sell',
    type: 'item',
    image: item,
  },
  {
    title: 'Vehicle for sale',
    desc: 'Sell a car, truck or other type of vehicle',
    type: 'vehicle',
    image: vehicle,
  },
  {
    title: 'Home for sale or rent',
    desc: 'List a house or apartment for sale or rent',
    type: 'house',
    image: house,
  },
]

export default function PostType() {
  return (
    <section className='max-w-xl mx-auto min-h-full grid'>
      <div className='place-self-center'>
        <h2 className='mb-4 text-xl font-bold'>Choose listing type</h2>
        <div className="grid grid-cols-3 gap-2">
          {postTypeCards?.map((item, index) => (
            <Link
              to='/item/create/$type'
              params={{ type: item.type }}
              key={index}
              className="flex flex-col justify-center items-center text-center bg-white rounded-lg shadow p-8 hover:bg-slate-50"
            >
              <img
                src={item.image}
                alt=""
                className='object-cover aspect-square max-h-20 rounded-full'
              />
              <h3 className='mt-2 text-sm font-bold'>{item.title}</h3>
              <p className='text-xs text-slate-600'>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
