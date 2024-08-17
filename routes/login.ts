import express, { response } from 'express'

export const loginRoute = express.Router()

loginRoute.get("/login", (request, response) => {
    response.render('login')
})

loginRoute.post("/loginrequest", (request, response) => {
    console.log([request.body.username, request.body.password])
    response.send("hi")
})