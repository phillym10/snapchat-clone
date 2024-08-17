import express from "express"
import { token } from "../include/token"

export const pagesRoute = express.Router()


pagesRoute.get("/", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken) response.render("index"); else response.redirect("signup")
})