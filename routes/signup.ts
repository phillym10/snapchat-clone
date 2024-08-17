import express, { response } from 'express'
import { usersDb } from '../include/dbcnf'

export const signupRoute = express.Router()

signupRoute.get("/signup", (request, response) => {
    response.render('signup')
})

signupRoute.post("/signuprequest", (request, response) => {
    const username = request.body.username
    const password = request.body.password
    const newUser = {
        userid: "string",
        userauthtoken: "string",
        displayname: username,
        username: username,
        password: password,
        usercolor: "#5aaaff",
        friends: [],
        friendRequests: [],
        blockedUsers: [],
        closeFriend: null,
        verified: false,
        mode: "dark"
    }
    usersDb.insert(newUser, (data: any, error: any) => (!error) ? console.log("Added") : console.log("Not Added"))
    response.send("hi")
})