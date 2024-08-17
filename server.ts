import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { pagesRoute } from './routes/pages'
import { logonRoute } from './routes/logon'
import { logoutRoute } from './routes/logout'

const app = express()

app.set("view engine", 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

app.use("/", pagesRoute)
app.use("/", logonRoute)
app.use("/logout", logoutRoute)


app.listen(80)