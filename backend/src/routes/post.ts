import express from 'express'
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/post'
import { auth } from '../middlewares/auth'
import { uploadImages } from '../middlewares/image'
import { validatePost, validateUpdatePost } from '../middlewares/validate'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', auth, uploadImages, validatePost, createPost)
router.put('/:id', auth, uploadImages, validateUpdatePost, updatePost)
router.delete('/:id', auth, deletePost)

export { router as postRouter }
