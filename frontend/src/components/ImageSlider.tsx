import { useState } from "react"
import { splitImages } from "../utilities/functions"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"

type ImageSliderProps = {
  images: string
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [imageIndex, setImageIndex] = useState(0)

  const imageLists = splitImages(images)
  console.log(imageLists)

  function handleNext() {
    setImageIndex(prev => {
      return prev < (imageLists.length - 1) ? prev + 1 : 0
    })
  }

  function handlePrev() {
    setImageIndex(prev => {
      return prev > 0 ? prev - 1 : imageLists.length - 1
    })
  }

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex overflow-hidden">
        {imageLists.map(image => (
          <img
            key={image}
            src={`http://localhost:4000/${image}`}
            alt=""
            className="block object-cover aspect-video rounded w-full h-full flex-shrink-0 flex-grow-0 img-transition"
            style={{ translate: `${-100 * imageIndex}%` }}
          />
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="img-slide-btn left-0"
      >
        <FaAngleLeft />
      </button>
      <button
        onClick={handleNext}
        className="img-slide-btn right-0"
      >
        <FaAngleRight />
      </button>
      <div className='img-slider-circle-div'>
        {imageLists.map((image, index) => (
          <button
            key={index}
            onClick={() => setImageIndex(index)} 
          >
            <img 
              src={`http://localhost:4000/${image}`} 
              alt=""
              className={`block w-full aspect-square object-cover max-w-10 rounded-sm shadow-lg ${index === imageIndex && 'opacity-50'}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
