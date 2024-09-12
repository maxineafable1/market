import { Request, Response } from "express";
import { pool } from "../database";
import { deleteImagesFiles, setErrorAndStatusCode, validateVehicle } from "../utilities/functions";
import { ValidatedPost, ValidatedUpdatePost } from "../utilities/types";

async function getPosts(req: Request, res: Response) {
  const page = req.query.page
  const itemsPerPage = req.query.items

  try {
    if (!itemsPerPage || !page)
      return res.status(400).json({ error: 'Invalid search for posts' })

    // this sets the pagination to get the posts
    const posts = await pool.query(`SELECT post_id, title, price, description, images, condition, type FROM posts LIMIT ${itemsPerPage} OFFSET ${(+page - 1) * +itemsPerPage}`)
    res.status(200).json(posts.rows)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function getPost(req: Request, res: Response) {
  const { id: postId } = req.params
  const type = req.query.type

  try {
    if (!type || type !== 'vehicles' && type !== 'items')
      return res.status(400).json({ error: 'Invalid search for post' })

    // to get the post details by using its type 
    const post = await pool.query(`SELECT * FROM posts p INNER JOIN ${type} t USING (post_id) WHERE p.post_id = $1`, [postId])
    if (post.rowCount === 0)
      return res.sendStatus(404)

    return res.status(200).json(post.rows[0])
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function createPost(req: Request, res: Response) {
  const { title, price, description, type, condition, fileNames, userId } = res.locals.postObject as ValidatedPost
  try {
    if (type === 'vehicle') {
      const vehicle = validateVehicle(req, res, fileNames)
      if (!vehicle) return

      const fileNamesString = fileNames.join(',')
      const post = await pool.query('INSERT INTO posts (title, price, description, type, condition, images, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING post_id', [title, price, description, type, condition, fileNamesString, userId])

      const { make, model, year, extColor, vehicleCondition, mileage, bodyStyle, intColor, fuelType, transmission, cleanTitle } = vehicle
      await pool.query('INSERT INTO vehicles (make, model, year, exterior_color, condition, mileage, body_style, interior_color, fuel_type, transmission, clean_title, post_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [make, model, year, extColor, vehicleCondition, mileage, bodyStyle, intColor, fuelType, transmission, cleanTitle, post.rows[0].post_id])
    }
    res.sendStatus(201)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function deletePost(req: Request, res: Response) {
  const { id: postId } = req.params
  const { id: userId } = req.user
  try {
    const postToDelete = await pool.query('DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING images', [postId, userId])
    if (postToDelete.rowCount === 0)
      return res.sendStatus(404)

    // delete images files
    const fileNames = postToDelete.rows[0].images.split(',')
    deleteImagesFiles(fileNames)

    res.sendStatus(204)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function updatePost(req: Request, res: Response) {
  const { title, price, description, type, condition, fileNames, postId, userId, currentImages } = res.locals.updatedPostObject as ValidatedUpdatePost
  try {
    if (type === 'vehicle') {
      const vehicle = validateVehicle(req, res, fileNames)
      if (!vehicle) return

      // if passed all validations delete the current post images
      deleteImagesFiles(currentImages.split(','))

      const fileNamesString = fileNames.join(',')
      const postToUpdate = await pool.query('UPDATE posts SET title = $1, price = $2, description = $3, type = $4, condition = $5, images = $6 WHERE post_id = $7 AND user_id = $8 RETURNING post_id', [title, price, description, type, condition, fileNamesString, postId, userId])
      if (postToUpdate.rowCount === 0)
        return res.sendStatus(404)

      const { make, model, year, extColor, vehicleCondition, mileage, bodyStyle, intColor, fuelType, transmission, cleanTitle } = vehicle
      await pool.query('UPDATE vehicles SET make = $1, model = $2, year = $3, exterior_color = $4, condition = $5, mileage = $6, body_style = $7, interior_color = $8, fuel_type = $9, transmission = $10, clean_title = $11 WHERE post_id = $12', [make, model, year, extColor, vehicleCondition, mileage, bodyStyle, intColor, fuelType, transmission, cleanTitle, postId])
    }
    res.sendStatus(204)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

export {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
}