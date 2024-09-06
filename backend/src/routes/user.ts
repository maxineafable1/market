import express from 'express'
import { deleteUser, getNewAccessToken, login, logout, signup, updateUserInfo, userInfo } from '../controllers/user'
import { auth } from '../middlewares/auth'
import { upload } from '../middlewares/image'

const router = express.Router()

router.get('/', auth, userInfo)
router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', auth, logout)
router.delete('/delete-user', auth, deleteUser)
router.post('/refresh-token', auth, getNewAccessToken)
router.put('/update-user', auth, upload.single('file'), updateUserInfo)

export { router as userRouter }