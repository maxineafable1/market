import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { pool } from "../database";
import { PayloadType } from "../utilities/types";
import { getAccessToken, getRefreshToken } from "../utilities/tokens";
import { setErrorAndStatusCode, validEmail, validText } from "../utilities/functions";

const DEFAULT_IMAGE = 'default.png'

async function userInfo(req: Request, res: Response) {
  // const { id: userId } = req.user
  const { id: userId } = req.params

  try {
    // phone, email, first_name, last_name, image
    const user = await pool.query('SELECT user_id, phone, email, first_name, last_name, image FROM users WHERE user_id = $1', [userId])

    if (user.rowCount === 0)
      return res.sendStatus(404)

    res.status(200).json(user.rows[0])
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function login(req: Request, res: Response) {
  const { phoneOrEmail, password } = req.body

  if (!phoneOrEmail || !password)
    return res.status(400).json({ error: 'All fields are required' })

  const userExists = await pool.query('SELECT * FROM users WHERE phone = $1 OR email = $1', [phoneOrEmail])
  if (userExists.rowCount === 0)
    return res.status(400).json({ error: 'Incorrect credentials' })

  const correctPassword = bcrypt.compareSync(password, userExists.rows[0].password)
  if (!correctPassword)
    return res.status(400).json({ error: 'Incorrect credentials' })

  try {
    const payload: PayloadType = {
      id: userExists.rows[0].user_id
    }

    const access = getAccessToken(payload)
    const refresh = getRefreshToken(payload)

    // store refresh token on database
    await pool.query("INSERT INTO tokens (refresh, user_id) VALUES ($1, $2)", [refresh, payload.id])

    res.status(200).json({ access, refresh })
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function signup(req: Request, res: Response) {
  const { phone, email, password } = req.body

  if (!phone || !email || !password)
    return res.status(400).json({ error: 'All fields are required' })

  if (!validText(phone, 11, 11))
    return res.status(400).json({ error: 'Enter a valid phone number' })

  if (!validEmail(email))
    return res.status(400).json({ error: 'Enter a valid email address' })

  if (!validText(password, 8, 255))
    return res.status(400).json({ error: 'Password length must be 8 to 255 characters' })

  const userExists = await pool.query('SELECT phone, email FROM users WHERE phone = $1 OR email = $2', [phone, email])
  if (userExists.rowCount !== 0)
    return res.status(400).json({ error: 'User already exists' })

  // hash the password
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  try {
    const image = DEFAULT_IMAGE
    const newUser = await pool.query('INSERT INTO users (phone, email, password, image) VALUES ($1, $2, $3, $4) RETURNING *', [phone, email, hashedPassword, image])

    const payload: PayloadType = {
      id: newUser.rows[0].user_id
    }

    const access = getAccessToken(payload)
    const refresh = getRefreshToken(payload)

    // store refresh token on database
    await pool.query('INSERT INTO tokens (refresh, user_id) VALUES ($1, $2)', [refresh, payload.id])

    res.status(201).json({ access, refresh })
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function logout(req: Request, res: Response) {
  // TODO: need refactor
  const { refresh } = req.body
  // const { id: userId } = req.user

  if (!refresh)
    return res.status(400).json({ error: 'Refresh token not found' })

  try {
    // await pool.query('DELETE FROM tokens WHERE refresh = $1 AND user_id = $2', [refresh, userId])
    await pool.query('DELETE FROM tokens WHERE refresh = $1', [refresh])
    res.sendStatus(204)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function deleteUser(req: Request, res: Response) {
  const { id: userId } = req.user
  try {
    const userToDelete = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId])

    if (userToDelete.rowCount === 0)
      return res.sendStatus(404)

    if (userToDelete.rows[0].image !== DEFAULT_IMAGE) {
      // if the image is already changed delete the current
      const filepath = path.resolve('uploads', userToDelete.rows[0].image)
      fs.unlinkSync(filepath)
    }

    res.sendStatus(204)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

async function getNewAccessToken(req: Request, res: Response) {
  // TODO: need refactor
  const { refresh } = req.body
  // const { id: userId } = req.user

  if (!refresh)
    // return res.status(400).json({ error: 'Refresh token not found' })
    return res.status(401).json({ error: 'Refresh token not found' })

  // const refreshTokenStored = await pool.query('SELECT * FROM tokens WHERE refresh = $1 AND user_id = $2', [refresh, userId])
  const refreshTokenStored = await pool.query('SELECT * FROM tokens WHERE refresh = $1', [refresh])

  if (refreshTokenStored.rowCount === 0)
    return res.status(403).json({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH_KEY as string)
    req.user = decoded

    // const payload: PayloadType = {
    //   id: userId
    // }

    const payload: PayloadType = {
      id: req.user.id
    }

    const access = getAccessToken(payload)
    res.status(200).json({ access })
  } catch (error) {
    setErrorAndStatusCode(res, error, 403)
  }
}

async function updateUserInfo(req: Request, res: Response) {
  const { firstName, lastName } = req.body
  const image = req.file?.filename ?? DEFAULT_IMAGE
  const { id: userId } = req.user

  if (!firstName || !lastName) {
    if (image !== DEFAULT_IMAGE) {
      /*
        if the body is empty
        delete the image that is uploaded
      */
      const filepath = path.resolve('uploads', image as string)
      fs.unlinkSync(filepath)
    }
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!validText(firstName, 1, 100))
    return res.status(400).json({ error: 'First name length must be 1 to 100 characters' })

  if (!validText(lastName, 1, 100))
    return res.status(400).json({ error: 'Last name length must be 1 to 100 characters' })

  // get the current image to delete
  const userImage = await pool.query('SELECT image FROM users WHERE user_id = $1', [userId])
  if (userImage.rows[0].image !== DEFAULT_IMAGE) {
    // if the image is already changed delete the current
    const filepath = path.resolve('uploads', userImage.rows[0].image)
    fs.unlinkSync(filepath)
  }

  try {
    await pool.query('UPDATE users SET first_name = $1, last_name = $2, image = $3 WHERE user_id = $4', [firstName, lastName, image, userId])
    res.sendStatus(204)
  } catch (error) {
    setErrorAndStatusCode(res, error, 500)
  }
}

export {
  userInfo,
  login,
  signup,
  logout,
  deleteUser,
  getNewAccessToken,
  updateUserInfo,
}