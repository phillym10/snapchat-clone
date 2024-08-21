import express from 'express'
import { chatsDb, messagesDb } from '../include/dbcnf'
import { Chat, Message } from '../types/types'
import { keygen } from '../include/keygen'
import { token } from '../include/token'

export const messagingRoute = express.Router()

messagingRoute.post("/sendmsg", async (request, response) => {
    const chatid = request.body.chatid
    const message = request.body.message
    const messageType = request.body.msgtype
    const replyToMessageId = request.body.replytomsgid
    const userAuthToken = token.auth(request)

    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        const newMessageId = keygen.msgid()
        const newMessage: Message = {
            messageid: newMessageId,
            messagetimeout: 3600000,
            userid: currentUser.userid,
            type: messageType,
            chat: (messageType == "chat" || messageType == "deleted") ? message : "",
            snap: (messageType == "snap") ? message : "",
            time: Date.now(),
            reactions: [],
            saved: false,
            replyto: replyToMessageId,
            chatid: chatid
        }
        messagesDb.insert(newMessage, (data: any, err: any) => {
            if (err) return
            if (!data) return
            chatsDb.findOne({ chatid: chatid }, (chatdata: Chat, error: any) => {
                if (error) return
                const msgs = chatdata.messages
                msgs.push(newMessageId)
                chatsDb.update(
                    { chatid: chatid },
                    { messages: msgs },
                    false,
                    (data: any, error1: any) => {
                        if (!error1 && data == "updated") response.send({ message: "success" })
                    }
                )
            })
        })
    }
})

messagingRoute.post("/getlastmsg", (request, response) => {
    const chatid = request.body.chatid
    chatsDb.findOne({ chatid: chatid }, (chat: Chat, error: any) => {
        if (error) return
        if (chat.messages.length > 0) {
            const lastMessageId = chat.messages[chat.messages.length - 1]
            messagesDb.findOne({ messageid: lastMessageId }, (message: Message,  error1: any) => {
                if (error) return
                response.send({ message: message })
            })
        } else response.send({ message: undefined })
    })
})