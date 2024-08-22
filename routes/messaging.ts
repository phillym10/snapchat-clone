import express from 'express'
import { chatsDb, messagesDb, usersDb } from '../include/dbcnf'
import { Chat, Message } from '../types/types'
import { keygen } from '../include/keygen'
import { token } from '../include/token'
import path from 'path'
import fs from 'fs'

export const messagingRoute = express.Router()

async function saveSnap (base64: string, messageid: string) {
    let base64Data = base64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    // get extension
    const match = base64.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    let extension = ""
    if (match && match[1]) extension = match[1]; // "png", "jpeg", "gif", etc.

    // validate base64 data and get all necessary data
    const paddedBase64 = base64Data.padEnd(base64.length + (4 - (base64Data.length % 4)) % 4, '=');
    const buffer = Buffer.from(paddedBase64, 'base64');
    const filename = `${messageid}.${extension}`;
    const filepath = path.join('public', 'snaps', filename)

    // check if user already has a profile picture
    const profilePictures = fs.readdirSync(path.join('public', 'snaps'))
    const existingUserProfilePicture = profilePictures.find(file => path.parse(file).name === messageid)

    if (existingUserProfilePicture) {
        const existingUserProfilePicturePath = path.join('public', 'snaps', existingUserProfilePicture);
        fs.unlinkSync(existingUserProfilePicturePath)
        fs.writeFileSync(filepath, buffer);
    } else fs.writeFileSync(filepath, buffer);

    return filename
}

messagingRoute.post("/sendmsg", async (request, response) => {
    const chatid = request.body.chatid
    const message = request.body.message
    const messageType = request.body.msgtype
    const replyToMessageId = request.body.replytomsgid
    const userAuthToken = token.auth(request)

    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        const newMessageId = keygen.msgid()
        const snapFilename: string = (messageType == "snap") ? await saveSnap(message,newMessageId) : ""
        const newMessage: Message = {
            messageid: newMessageId,
            messagetimeout: 3600000,
            userid: currentUser.userid,
            type: messageType,
            chat: (messageType == "chat" || messageType == "deleted") ? message : "",
            snap: (messageType == "snap") ? `snaps/${snapFilename}` : "",
            opened: false,
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

messagingRoute.post("/getmessagesnap", (request, response) => {
    const messageid = request.body.messageid
    messagesDb.findOne({ messageid: messageid }, (msg: Message, error: any) => {
        if (error) return
        if (msg) response.send({ message: msg })
    })
})

messagingRoute.post("/getmsgowner", (request, response) => {
    const messageid = request.body.messageid
    messagesDb.findOne({ messageid: messageid }, (msg: Message, error: any) => {
        if (error) return
        usersDb.findOne({ userid: msg.userid }, (user: User, error1: any) => {
            if (error1) return
            if (user) response.send({ message: user })
        })
    })
})