import express from "express"

export const pagesRoute = express.Router()



pagesRoute.get("/", (request, response) => {
    response.send("hello")
})