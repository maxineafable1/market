import { useEffect, useRef, useState } from "react"
import { FaCaretDown } from "react-icons/fa"

export type PostFormType = {
  vehicleType: string
  year: string
  make: string
  model: string
  mileage: string
  extColor: string
  intColor: string
  bodyStyle: string
  vehicleCondition: string
  fuelType: string
  transmission: string
  description: string
  price: string
}

type SelectFormProps = {
  postForm: PostFormType
  setPostForm: React.Dispatch<React.SetStateAction<PostFormType>>
  choices: string[]
  defaultValue: string
  postFormKey: string
}

export default function SelectForm({ postForm, setPostForm, choices, defaultValue, postFormKey }: SelectFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative mb-2">
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between p-4 rounded border border-black"
      >
        <p>{postForm[postFormKey as keyof PostFormType] || defaultValue}</p>
        <FaCaretDown />
      </div>
      <div
        ref={divRef}
        className={`absolute z-10 p-4 bg-white w-full rounded-md shadow-md ${isOpen ? 'block' : 'hidden'}`}
      >
        <ul className="flex flex-col gap-2">
          {choices.map((choice, index) => (
            <li
              key={index}
              className="hover:bg-slate-200 rounded px-1"
              onClick={() => {
                setPostForm({ ...postForm, [postFormKey]: choice })
                setIsOpen(false)
              }}
            >
              {choice}
            </li>
          ))}
        </ul>
      </div>
    </div>


  )
}
