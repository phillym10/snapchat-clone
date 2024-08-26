import express from 'express'
import { chatsDb, messagesDb, streaksDb, usersDb } from '../include/dbcnf'
import { Chat, Message, Streak } from '../types/types'
import { keygen } from '../include/keygen'
import { token } from '../include/token'
import path from 'path'
import fs from 'fs'
import { anyuser } from '../include/users'
import { wdate } from '../include/datetime'

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

function checkIfMessagesAreEqual (message1: any, message2: any) {
    return (
        message1.userid === message2.userid &&
        message1.chatid === message2.chatid &&
        message1.messageid === message2.messageid
    )
}

async function handleStreaks(chatid: string, userid: string) {
    streaksDb.findOne({ chatid: chatid }, (data: any, err: any) => {
        if (data == undefined) {
            const newStreak: Streak = {
                chatid: chatid,
                lastuser: userid,
                streakcount: 1,
                time: Date.now(),
                date: wdate.current()
            }
            streaksDb.insert(newStreak, (data: any, error1: any) => {})
        } else {
            let streak = data;
            if ((Date.now() - streak.time) < 3600000) {
                const streak_counter = (streak.date == wdate.current()) ? 0 : 1

                streak.streakcount = (streak.lastuser == userid)
                ? streak.streakcount
                : streak.streakcount + streak_counter
                
                streak.time = (streak.lastuser == userid)
                ? streak.time
                : Date.now()
                streaksDb.update(
                    { chatid: chatid },
                    streak, false, (resultdata: any, error2: any) => {}
                )
            }
        }
    })
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

        if (messageType == "snap") {
            await handleStreaks(chatid, currentUser.userid)
            usersDb.update(
                { userid: currentUser.userid },
                { snapscore: currentUser.snapscore+1 }, false, (data: any, error: any) => {}
            )
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

messagingRoute.post("/getmsg", (request, response) => {
    const messageid = request.body.messageid
    messagesDb.findOne({ messageid: messageid }, (message: Message,  error: any) => {
        if (error) return
        response.send({ message: message })
    })
})

messagingRoute.post("/getlastmsg", (request, response) => {
    const chatid = request.body.chatid
    const lastMessage = request.body.lastmsg
    chatsDb.findOne({ chatid: chatid }, (chat: Chat, error: any) => {
        if (error) return
        if (chat.messages.length > 0) {
            const lastMessageId = chat.messages[chat.messages.length - 1]
            messagesDb.findOne({ messageid: lastMessageId }, (message: Message,  error1: any) => {
                if (error) return
                if (checkIfMessagesAreEqual(message, lastMessage)) response.send({ message: undefined }); else 
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

messagingRoute.post("/togglesavemsg", (request, response) => {
    const messageid = request.body.messageid
    const messageSaveState: boolean = request.body.saveState
    if (messageid == null || typeof messageSaveState !== "boolean") return
    messagesDb.update(
        { messageid: messageid },
        { saved: messageSaveState },
        false,
        (data: any, error: any) => { if (!error) response.send({ message: "updated" }) }
    )
})

messagingRoute.post("/editmsg", (request, response) => {
    const messageid = request.body.messageid
    const newMsg = request.body.message
    if (messageid == null || newMsg == null) return
    messagesDb.update(
        { messageid: messageid },
        { message: newMsg },
        false,
        (data: any, error: any) => { if (!error) response.send({ message: "updated" }) }
    )
})

async function deleteMessage(chatid: string, messageid: string) {
    chatsDb.findOne({ chatid: chatid }, async (chatdata: Chat, error: any) => {
        if (error) return
        if (!chatdata.messages.includes(messageid)) return
        messagesDb.findOne({ messageid: messageid }, async (message: Message, error1: any) => {
            if (error1) return
            const user: any = await anyuser.get(message.userid)
            messagesDb.update(
                { chatid: chatid, messageid: messageid },
                { chat: user.displayname, type: "deleted", userid: "" },
                false,
                (data: any, error: any) => {}
            )
        })
    })
}

async function deleteSnapMessage(chatid: string, messageid: string, snappath: string) {
    chatsDb.findOne({ chatid: chatid }, async (chatdata: Chat, error: any) => {
        if (error) return
        if (!chatdata.messages.includes(messageid)) return
        messagesDb.findOne({ messageid: messageid }, async (message: Message, error1: any) => {
            if (error1) return
            const user: any = await anyuser.get(message.userid)
            messagesDb.update(
                { chatid: chatid, messageid: messageid },
                { chat: user.displayname, type: "deleted", userid: "" },
                false,
                (data: any, error: any) => {
                    fs.unlinkSync(path.join("public", "snaps", snappath))
                }
            )
        })
    })
}

messagingRoute.post("/deletemsg", (request, response) => {
    const messageid = request.body.messageid
    if (messageid == null) return
    messagesDb.findOne({ messageid: messageid }, async (messageData: Message, error: any) => {
        if (error) return
        console.log(messageid)
        if (messageData.type == "chat") {
            await deleteMessage(messageData.chatid, messageData.messageid)
        } else if (messageData.type == "snap") {
            if (messageData.snap == undefined || messageData.snap == null) return
            await deleteSnapMessage(messageData.chatid, messageData.messageid, messageData.snap)
        }
    })
})

messagingRoute.post("/opensnap", (request, response) => {
    const messageid = request.body.messageid
    messagesDb.findOne({ messageid: messageid }, (msg: Message, error: any) => {
        if (error) return
        if (msg.type !== "snap") return
        messagesDb.update(
            { messageid: messageid },
            { opened: true },
            false, (user: User, error1: any) => {
            if (error1) return
            if (user) response.send({ message: user })
        })
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