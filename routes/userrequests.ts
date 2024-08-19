import express from 'express'
import { token } from '../include/token';
import { usersDb } from '../include/dbcnf';


export const userRequestRoute = express.Router()

userRequestRoute.get("/:key", (request, response) => {
    const key = request.params.key
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        usersDb.findOne({ userauthtoken: userAuthToken }, (data: any, error: any) => {
            if (!error && data && Object.keys(data).includes(key)) response.send({ message: data[key] })
        })
    }
})

userRequestRoute.get("/", (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        usersDb.findOne({ userauthtoken: userAuthToken }, (data: any, error: any) => {
            if (!error && data) response.send({ message: data })
        })
    }
})

type UpdateableKeysTypes = 'displayname' | 'username' | 'password' | 'usercolor';
type UpdateableKeysInUser = {displayname: string,username: string,password: string,usercolor: string}

userRequestRoute.post("/update/:key/:value", (request, response) => {
    const key: UpdateableKeysTypes | string = request.params.key
    if (key !== "displayname" && key !== "username" && key !== "password" && key !== "usercolor") return

    const value = request.params.value
    const userAuthToken = token.auth(request)
    const updateableKeysInUser = {displayname: "",username: "",password: "",usercolor: ""}

    if (!Object.keys(updateableKeysInUser).includes(key)) response.send("fail")
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        usersDb.findOne({ userauthtoken: userAuthToken }, (data: UpdateableKeysInUser, error: any) => {
            if (error || !data || data == null) return
            const currentUser: UpdateableKeysInUser = data;

            if (!Object.keys(currentUser).includes(key)) return
            currentUser[key] = value

            usersDb.update(
                { userauthtoken: userAuthToken },
                currentUser,
                false,
                (data: any, err: any) => { response.send({ message: data}) }
            )
        })
    }
})

