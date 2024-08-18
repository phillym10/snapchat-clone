import express from 'express'
import { usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { keygen } from '../include/keygen'
import { User } from '../types/types'

export const logonRoute = express.Router()

logonRoute.get("/login", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) {
        response.render('login')
    } else response.redirect("/")
})

logonRoute.post("/loginrequest", (request, response) => {
    const username = request.body.username
    const password = request.body.password
    if (username == "" || password == "") return
    usersDb.findOne({ username: username, password: password }, (data: User, error: any) => {
        if (!error && data) {
            response.cookie("snapchatcloneauth", data.userauthtoken, {
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
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) {
        response.render('signup')
    } else response.redirect("/")
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
                if (!error && data) {
                    response.cookie("snapchatcloneauth", newUser.userauthtoken, {
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