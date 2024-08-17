import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { pagesRoute } from './routes/pages'
import { loginRoute } from './routes/login'

const app = express()

app.set("view engine", 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

app.use("/", pagesRoute)
app.use("/", loginRoute)


app.listen(80)