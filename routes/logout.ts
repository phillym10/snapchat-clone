import express from 'express'
export const logoutRoute = express.Router()

logoutRoute.get("/", (request, response) => {
    response.clearCookie("snapchatcloneauth")
    response.redirect('/login')
})