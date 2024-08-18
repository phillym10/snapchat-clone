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