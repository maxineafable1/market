import { NextFunction, Request, Response } from "express";
import { CreatePost, ValidatedPost, ValidatedUpdatePost } from "../utilities/types";
import { deleteImagesFiles, setErrorAndStatusCode, setRequestBodyError, validNumber, validText } from "../utilities/functions";
import { pool } from "../database";

function validatePost(req: Request, res: Response, next: NextFunction) {
  const { id: userId } = req.user
  const { title, price, description, type, condition }: CreatePost = req.body

  const images = req.files
  const fileNames = (images as Array<Express.Multer.File>)?.map((image) => image.filename)

  if (fileNames?.length === 0)
    return setRequestBodyError(res, 400, 'Images are required')

  if (!title || !price || !type || !condition)
    return setRequestBodyError(res, 400, 'All fields are required', fileNames)

  if (!validText(title, 1, 10))
    return setRequestBodyError(res, 400, 'Title length must be 1 to 200 characters', fileNames)

  if (!validNumber(price, 999_999))
    return setRequestBodyError(res, 400, 'Enter a valid price', fileNames)

  if (!validText(description, 1, 1000))
    return setRequestBodyError(res, 400, 'Description length must be 1 to 1000 characters', fileNames)

  if (!validText(type, 1, 100))
    return setRequestBodyError(res, 400, 'Type length must be 1 to 100 characters', fileNames)

  if (!validText(condition, 1, 100))
    return setRequestBodyError(res, 400, 'Condition length must be 1 to 100 characters', fileNames)

  const postObject: ValidatedPost = {
    title,
    price,
    description,
    type,
    condition,
    fileNames,
    userId,
  }
  res.locals.postObject = postObject
  next()
}


async function validateUpdatePost(req: Request, res: Response, next: NextFunction) {
  const { id: postId } = req.params
  const { id: userId } = req.user
  const { title, price, description, type, condition }: CreatePost = req.body

  const images = req.files
  const fileNames = (images as Array<Express.Multer.File>)?.map((image) => image.filename)

  const currentImages = await pool.query('SELECT images FROM posts WHERE post_id = $1 AND user_id = $2', [postId, userId])
  if (currentImages.rowCount === 0) {
    // if there is no post, delete all the images that were uploaded
    if (fileNames?.length > 0) {
      deleteImagesFiles(fileNames)
    }
    return res.sendStatus(404)
  }

  // validate form data if post was found
  if (fileNames?.length === 0)
    return setRequestBodyError(res, 400, 'Images are required')

  if (!title || !price || !type || !condition)
    return setRequestBodyError(res, 400, 'All fields are required', fileNames)

  if (!validText(title, 1, 10))
    return setRequestBodyError(res, 400, 'Title length must be 1 to 200 characters', fileNames)

  if (!validNumber(price, 999_999))
    return setRequestBodyError(res, 400, 'Enter a valid price', fileNames)

  if (!validText(description, 1, 1000))
    return setRequestBodyError(res, 400, 'Description length must be 1 to 1000 characters', fileNames)

  if (!validText(type, 1, 100))
    return setRequestBodyError(res, 400, 'Type length must be 1 to 100 characters', fileNames)

  if (!validText(condition, 1, 100))
    return setRequestBodyError(res, 400, 'Condition length must be 1 to 100 characters', fileNames)

  const updatedPostObject: ValidatedUpdatePost = {
    title,
    price,
    description,
    type,
    condition,
    fileNames,
    currentImages: currentImages.rows[0].images,
    postId: +postId,
    userId,
  }
  res.locals.updatedPostObject = updatedPostObject
  next()
}

export {
  validatePost,
  validateUpdatePost,
}