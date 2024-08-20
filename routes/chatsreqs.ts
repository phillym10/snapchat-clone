import express from 'express'
import { chatsDb, messagesDb, usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { anyuser, friendship } from '../include/users'
import { User, Friend, Chat, ChatLog, Message } from '../types/types'
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

chatsRoute.post("/sendmsg/:type", (request, response) => {
    const chatid = request.body.chatid
    const replyto = request.body.replyto
    const msg = request.body.msg
    const snap = request.body.snap
    const msgType = request.params.type
    const userAuthToken = token.auth(request)

    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        if (msgType !== "snap" && msgType !== "chat" && msgType !== "deleted") return
        const message: Message = {
            messageid: keygen.msgid(),
            messagetimeout: (Date.now()) + 10000, // 10 seconds for testing
            type: msgType,
            chat: msg,
            snap: snap,
            time:  Date.now(),
            reactions: [],
            saved: false,
            replyto: replyto,
            chatid: chatid
        }
        messagesDb.insert(message, (data: any, error: any) => {
            if (error || !data) return
            response.send({ message: "success" })
        })
    }
})