import express from 'express'
import cors from 'cors'
import { userRouter } from './routes/user'

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

app.use('/api/users', userRouter)

app.use((req, res, next) => {
  res.status(404).send('Sorry can\'t find that!')
})

app.listen(PORT, () => console.log('server running'))