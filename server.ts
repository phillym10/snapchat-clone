import express from 'express'
import { pagesRoute } from './routes/pages'

const app = express()

app.use("/", pagesRoute)


app.listen(80)