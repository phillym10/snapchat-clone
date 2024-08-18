import express from "express"
import { token } from "../include/token"
import { usersDb } from "../include/dbcnf"

export const pagesRoute = express.Router()

pagesRoute.get("/", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) {
        response.redirect('/login')
    } else response.render("index")
})