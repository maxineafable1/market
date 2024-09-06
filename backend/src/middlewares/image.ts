import path from 'path'
import multer from 'multer'

const MAX_FILE_SIZE = 1024 * 1024

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // prevents other files besides image to be uploaded
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
  },
  limits: {
    fileSize: MAX_FILE_SIZE
  }
})