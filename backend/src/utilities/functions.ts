import { Request, Response } from "express"
import path from 'path'
import fs from 'fs'
import { VehiclePost } from "./types"

function validText(text: string, min = 1, max = Number.POSITIVE_INFINITY): boolean {
  if (!text) return false
  const textLength = text.trim().length
  return textLength >= min && textLength <= max
}

function validEmail(email: string) {
  if (!validText(email, 1, 255)) return null
  return email.toLowerCase().match(
    /^\S+@\S+\.\S+$/
  )
}

function getErrorMessage(error: unknown): string {
  let message: string
  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Unknown error'
  }
  return message
}

function setErrorAndStatusCode(res: Response, error: unknown, code: number) {
  const errorMessage = getErrorMessage(error)
  res.status(code).json({ error: errorMessage })
}

function validNumber(value: number, max = Number.POSITIVE_INFINITY): boolean {
  return value > 0 && value <= max
}

function validBoolean(value: unknown) {
  return typeof value === 'boolean'
}

function validYear(year: number) {
  return year <= new Date().getFullYear()
}

function validateVehicle(req: Request, res: Response, fileNames: string[]) {
  const { make, model, year, extColor, vehicleCondition, mileage, bodyStyle, intColor, fuelType, transmission, cleanTitle }: VehiclePost = req.body

  if (!make || !model || !year || !extColor || !vehicleCondition)
    return setRequestBodyError(res, 400, 'All fields are required', fileNames)

  if (!validText(make, 1, 200))
    return setRequestBodyError(res, 400, 'Make length must be 1 to 200 characters', fileNames)

  if (!validText(model, 1, 200))
    return setRequestBodyError(res, 400, 'Model length must be 1 to 200 characters', fileNames)

  // TODO make a valid year
  if (!validYear(year))
    return setRequestBodyError(res, 400, 'Enter a valid year', fileNames)

  if (!validNumber(mileage, 500))
    return setRequestBodyError(res, 400, 'Enter a valid mileage', fileNames)

  if (!validText(extColor, 1, 100))
    return setRequestBodyError(res, 400, 'Exterior color length must be 1 to 100 characters', fileNames)

  if (!validText(intColor, 1, 100))
    return setRequestBodyError(res, 400, 'Interior color length must be 1 to 100 characters', fileNames)

  if (!validText(vehicleCondition, 1, 100))
    return setRequestBodyError(res, 400, 'Vehicle condition length must be 1 to 100 characters', fileNames)

  if (!validText(fuelType, 1, 100))
    return setRequestBodyError(res, 400, 'Enter a valid fuel type', fileNames)

  if (!validText(transmission, 1, 100))
    return setRequestBodyError(res, 400, 'Enter a valid transmission type', fileNames)

  if (!validText(bodyStyle, 1, 100))
    return setRequestBodyError(res, 400, 'Body style length must be 1 to 100 characters', fileNames)

  // TODO validate true or false for cleanTitle
  if (!validBoolean(cleanTitle))
    return setRequestBodyError(res, 400, 'Clean title must be true or false', fileNames)

  return {
    make,
    model,
    year,
    extColor,
    vehicleCondition,
    mileage,
    bodyStyle,
    intColor,
    fuelType,
    transmission,
    cleanTitle,
  }
}

function setRequestBodyError(res: Response, code: number, message: string, fileNames?: string[]) {
  res.status(code).json({ error: message })
  if (fileNames)
    deleteImagesFiles(fileNames)
  return null
}

function deleteImagesFiles(fileNames: string[]) {
  fileNames.forEach(fileName => {
    const filepath = path.resolve('uploads', fileName)
    fs.unlinkSync(filepath)
  })
}

export {
  validText,
  validEmail,
  getErrorMessage,
  setErrorAndStatusCode,
  validNumber,
  validateVehicle,
  setRequestBodyError,
  deleteImagesFiles,
}