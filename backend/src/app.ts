import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { limiter } from './middlewares/rateLimit'
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

// app.use(cors())
app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }))
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json({ limit: '10kb' }))

app.options('*', cors())
app.use(limiter)
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console
const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log(DB_ADDRESS))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
