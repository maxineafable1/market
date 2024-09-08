import path from 'path'
import multer from 'multer'
import e, { NextFunction, Request, Response } from 'express'

const MAX_FILE_SIZE = 1024 * 1024

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // prevents other files besides image to be uploaded
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')
      return cb(new Error('Only images are allowed'))
    
    if (file.originalname.includes(','))
      return cb(new Error('Image filename must not include a comma'))
    
    cb(null, true)
  },
  limits: {
    fileSize: MAX_FILE_SIZE
  }
})

const singleUpload = upload.single('file')
const arrayUpload = upload.array('files', 10)

function uploadImage(req: Request, res: Response, next: NextFunction) {
  singleUpload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message })
    } else if (err instanceof Error) {
      return res.status(400).json({ error: err.message })
    } else if (err) {
      return res.status(500).json({ error: 'Unknown error' })
    } else {
      next()
    }
  })
}

function uploadImages(req: Request, res: Response, next: NextFunction) {
  arrayUpload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message })
    } else if (err instanceof Error) {
      return res.status(400).json({ error: err.message })
    } else if (err) {
      return res.status(500).json({ error: 'Unknown error' })
    } else {
      next()
    }
  })
}

export {
  uploadImages,
  uploadImage,
}