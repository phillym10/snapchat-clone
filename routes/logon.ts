import express from 'express'
import { usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { keygen } from '../include/keygen'

export const logonRoute = express.Router()

logonRoute.get("/login", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken !== "" || userAuthToken !== null) response.redirect("/")
    response.render('login')
})

logonRoute.post("/loginrequest", (request, response) => {
    const username = request.body.username
    const password = request.body.password
    if (username == "" || password == "") return
    usersDb.findOne({ username: username, password: password }, (data: User, error: any) => {
        if (!error && data) {
            response.cookie("snapchatcloneuath", data.userauthtoken, {
                maxAge: 86400000,
                httpOnly: true,
                path: "/"
            })
            response.send({message: "success"})
        } else response.send({message: "fail"})
    })
})

logonRoute.get("/signup", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken !== "" || userAuthToken !== null) response.redirect("/")
    response.render('signup')
})

logonRoute.post("/signuprequest", (request, response) => {
    const username = request.body.username
    const password = request.body.password
    if (username == "" || password == "") return
    usersDb.findOne({ username: username }, (data: any, err: any) => {
        if (!data || data.length < 1) {
            const newUser = {
                userid: keygen.uid(),
                userauthtoken: keygen.uauthtoken(),
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
            usersDb.insert(newUser, (data: any, error: any) => {
                if (!error) {
                    response.cookie("snapchatcloneuath", newUser.userauthtoken, {
                        maxAge: 86400000,
                        httpOnly: true,
                        path: "/"
                    })
                    response.send({message:"success"})
                } else response.send({message:"fail"})
            })
        } else response.send({message:"userexists"})
    })
})