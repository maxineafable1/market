import { Response } from "express"

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

export {
  validText,
  validEmail,
  getErrorMessage,
  setErrorAndStatusCode,
}