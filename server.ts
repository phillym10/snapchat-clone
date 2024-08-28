import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { pagesRoute } from './routes/pages'
import { logonRoute } from './routes/logon'
import { logoutRoute } from './routes/logout'
import { friendRequestsRoute } from './routes/friendreqsts'
import { userRequestRoute } from './routes/userrequests'
import { friendsRoute } from './routes/friends'
import { chatsRoute } from './routes/chatsreqs'
import { messagingRoute } from './routes/messaging'
import { miscRoute } from './routes/misc'
import { storyRoute } from './routes/stories'

const app = express()

app.set("view engine", 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

app.use("/", pagesRoute)
app.use("/", logonRoute)
app.use("/fr", friendRequestsRoute)
app.use("/logout", logoutRoute)
app.use("/user", userRequestRoute)
app.use("/friends", friendsRoute)
app.use("/chats", chatsRoute)
app.use("/msgs", messagingRoute)
app.use("/story", storyRoute)
app.use("/misc", miscRoute)


app.listen(80)