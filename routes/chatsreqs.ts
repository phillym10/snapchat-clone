import express from 'express'
import { chatsDb, messagesDb, usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { User, Friend, Chat, ChatLog, Message } from '../types/types'


async function getMessageInfo(messageId: string) {
    return new Promise((resolve) => {
        messagesDb.findOne({ messageid: messageId }, (msg: Message, error: any) => {
            if (error) resolve("fail"); else resolve(msg)
        })
    })
}

async function deleteMessage(chatid: string, messageid: string) {
    chatsDb.findOne({ chatid: chatid }, async (chatdata: Chat, error: any) => {
        const chatMessages = []
        for (let i = 0; i < chatdata.messages.length; i++) {
            const messageId = chatdata.messages[i];
            if (messageId !== messageid) chatMessages.push(chatdata.messages[i])
        }
        chatsDb.update(
            { chatid: chatid },
            { messages: chatMessages },
            false,
            (data: any, error: any) => {}
        )
    })
}
export const chatsRoute = express.Router()


chatsRoute.post("/getmsgs", (request, response) => {
    const chatid = request.body.chatid
    const userAuthToken = token.auth(request)

    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        chatsDb.findOne({ chatid: chatid }, async (chatdata: Chat, error: any) => {
            const messages = []
            for (let i = 0; i < chatdata.messages.length; i++) {
                const messageId = chatdata.messages[i];
                const messageData: any = await getMessageInfo(messageId)
                messages.push(messageData)
            }
            response.send({ message: messages })
        })
    }
})

chatsRoute.post("/chatinfo/:userid", (request, response) => {
    const userid = request.params.userid
    usersDb.findOne({ userid: userid }, (userdata: User, error: any) => {
        if (error) return
        response.send({ message: userdata })
    })
})

chatsRoute.post("/:id", (request, response) => {
    const chatid = request.params.id
    chatsDb.findOne({ chatid: chatid }, (chatdata: Chat, error: any) => {
        if (error) return
        response.send({ message: chatdata.log })
    })
})

