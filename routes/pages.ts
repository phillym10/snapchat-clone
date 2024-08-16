import express from "express"

export const pagesRoute = express.Router()


pagesRoute.get("/", (request, response) => {
    response.render("index")
})

pagesRoute.get("/login", (request, response) => {
    response.render("login")
})

pagesRoute.get("/signup", (request, response) => {
    response.render("signup")
})