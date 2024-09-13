import { useState } from "react"
import { postFormRoute } from "../App"
import { MdAddToPhotos } from "react-icons/md";
import SelectForm, { PostFormType } from "../components/SelectForm";

const vehicleTypeChoice = [
  'Motorcycle',
  'Car/Truck',
]

const yearChoce = [
  '2024',
  '2023',
]

const carMakeChoice = [
  'Alfa Romeo',
  'Aston Martin',
]

const bodyStyleChoice = [
  'Sedan',
  'Coupe'
]

const colorChoice = [
  'blue',
  'red',
]

const vehicleConditionChoice = [
  'excellent',
  'good'
]

const fuelTypeChoice = [
  'gasoline',
  'diesel',
]

const transmissionChoice = [
  'automatic',
  'manual',
]

export default function PostForm() {
  const { type } = postFormRoute.useParams()

  const [postForm, setPostForm] = useState<PostFormType>({
    vehicleType: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    extColor: '',
    intColor: '',
    bodyStyle: '',
    vehicleCondition: '',
    fuelType: '',
    transmission: '',
    description: '',
    price: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    console.log(postForm)
  }

  return (
    <section className="bg-white max-w-3xl mx-auto rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="font-bold text-2xl">Vehicle for sale</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <SelectForm
          postForm={postForm}
          setPostForm={setPostForm}
          choices={vehicleTypeChoice}
          defaultValue="Vehicle Type"
          postFormKey='vehicleType'
        />

        <div className="my-4 h-0.5 bg-slate-200"></div>

        <h3 className="font-bold mb-2">Photo upload</h3>
        <label className="border border-black w-full block p-4 rounded cursor-pointer ">
          <input type="file" name="files" />
          <div className="flex flex-col min-h-32 justify-center items-center">
            <MdAddToPhotos className="bg-gray-200 p-2 rounded-full" fontSize='2rem' />
            <span className="font-bold">Add photos</span>
          </div>
        </label>

        <div className="my-4 h-0.5 bg-slate-200"></div>

        {type === 'vehicle' && (
          <>
            <h3 className="font-bold">About this vehicle</h3>
            <p className="mb-2">Help buyers know more about the vehicle you're listing.</p>

            <SelectForm
              postForm={postForm}
              setPostForm={setPostForm}
              choices={yearChoce}
              defaultValue="Year"
              postFormKey="year"
            />
            {postForm.vehicleType === 'Car/Truck' ? (
              <SelectForm
                postForm={postForm}
                setPostForm={setPostForm}
                choices={carMakeChoice}
                defaultValue="Make"
                postFormKey="make"
              />
            ) : (
              <input
                className="flex w-full mb-2 items-center justify-between p-4 rounded border border-black"
                placeholder="Make"
              />
            )}

            <input
              className="flex w-full mb-2 items-center justify-between p-4 rounded border border-black"
              value={postForm.model}
              onChange={e => setPostForm({ ...postForm, model: e.target.value })}
              placeholder="Model"
            />

            {postForm.vehicleType === 'Car/Truck' && (
              <input
                className="flex w-full mb-2 items-center justify-between p-4 rounded border border-black"
                value={postForm.mileage}
                onChange={e => setPostForm({ ...postForm, mileage: e.target.value })}
                placeholder="Mileage"
              />
            )}
            {postForm.vehicleType === 'Motorcycle' && (
              <h2>MOTOR</h2>
            )}

            <div className="my-4 h-0.5 bg-slate-200"></div>

            <h3 className="font-bold">Price</h3>
            <p className="mb-2">Enter your price for this vehicle.</p>
            <input
              className="flex w-full items-center justify-between p-4 rounded border border-black"
              placeholder="Price"
            />

            <div className="my-4 h-0.5 bg-slate-200"></div>

            {postForm.vehicleType === 'Car/Truck' && (
              <>
                <h3 className="font-bold">Vehicle appearance and features</h3>
                <p className="mb-2">Add more about what your vehicle looks like and the features that it has.</p>
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={bodyStyleChoice}
                  defaultValue="Body Style"
                  postFormKey="bodyStyle"
                />
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={colorChoice}
                  defaultValue="Exterior Color"
                  postFormKey="extColor"
                />
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={colorChoice}
                  defaultValue="Interior Color"
                  postFormKey="intColor"
                />

                <div className="my-4 h-0.5 bg-slate-200"></div>

                <h3 className="font-bold">Vehicle details</h3>
                <p className="mb-2">Include more details to help connect interested buyers to your vehicle.</p>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p>This vehicle has a clean title.</p>
                    <p>This vehicle has no significant damage or persistent problems.</p>
                  </div>
                  <input type="checkbox" name="cleanTitle" />
                </div>
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={vehicleConditionChoice}
                  defaultValue="Vehicle Condition"
                  postFormKey="vehicleCondition"
                />
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={fuelTypeChoice}
                  defaultValue="Fuel Type"
                  postFormKey="fuelType"
                />
                <SelectForm
                  postForm={postForm}
                  setPostForm={setPostForm}
                  choices={transmissionChoice}
                  defaultValue="Transmission"
                  postFormKey="transmission"
                />
                <div className="my-4 h-0.5 bg-slate-200"></div>
              </>
            )}

            <h3 className="font-bold">Description</h3>
            <p className="mb-2">Tell buyers anything that you haven't had the chance to include yet about your vehicle.</p>
            <textarea
              className="flex w-full items-center justify-between p-4 rounded border border-black"
              placeholder="Description"
            ></textarea>
          </>
        )}
        <button>Submit</button>
      </form>
    </section>
  )
}
