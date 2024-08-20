import express from 'express'
import { chatsDb, usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { anyuser, friendship } from '../include/users'
import { User, Friend, Chat, ChatLog } from '../types/types'
import { isUser } from '../types/typechecker'
import { keygen } from '../include/keygen'

export const chatsRoute = express.Router()

chatsRoute.post("/:id", (request, response) => {
    const chatid = request.params.id
    chatsDb.findOne({ chatid: chatid }, (chatdata: Chat, error: any) => {
        if (error) return
        response.send({ message: chatdata.log })
    })
})