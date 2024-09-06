import jwt from 'jsonwebtoken'
import { PayloadType } from './types'

function getAccessToken(user: PayloadType) {
  return jwt.sign(user, process.env.ACCESS_KEY as string, { expiresIn: '1d' })
}

function getRefreshToken(user: PayloadType) {
  return jwt.sign(user, process.env.REFRESH_KEY as string)
}

export {
  getAccessToken,
  getRefreshToken,
}
