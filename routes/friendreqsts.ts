import express from 'express'
import { chatsDb, usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { anyuser, friendship } from '../include/users'
import { User, Friend, Chat, ChatLog } from '../types/types'
import { isUser } from '../types/typechecker'
import { keygen } from '../include/keygen'

export const friendRequestsRoute = express.Router()

friendRequestsRoute.post("/searchusers/:q", (request, response) => {
    const query = request.params.q
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/signup'); else {
        usersDb.search({ username: query, displayname: query }, async (data: User[], error: any) => {
            if (error || !data) return;

            const currentuser: User | any = await token.getuser(userAuthToken)
            const users: any[] = []
            if (currentuser == null || !isUser(currentuser)) return

            for (let i = 0; i < data.length; i++) {
                const user = data[i];
                const friendshipCheck = await friendship.check(user.userid, currentuser.userid)
                if (user.userauthtoken !== userAuthToken && friendshipCheck == "false") { users.push(user) }
            }

            response.send({ message: users })
        })
    }
})

friendRequestsRoute.post("/allfr", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/signup'); else {
        const currentuser: User | any = await token.getuser(userAuthToken)
        const users: any[] = []
        if (currentuser == null || !isUser(currentuser)) return

        if (currentuser.friendRequests.length > 0) {
            for (let i = 0; i < currentuser.friendRequests.length; i++) {
                const fr_userid = currentuser.friendRequests[i];
                const fr_user = await anyuser.get(fr_userid)
                users.push(fr_user)
            }
        }

        response.send({ message: users })
    }
})

friendRequestsRoute.post("/sendfr", async (request, response) => {
    const touserid = request.body.touserid
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.render('signup'); else {
        const currentuserid = await token.getkey(userAuthToken, "userid")
        if (typeof currentuserid !== "string") return
        usersDb.findOne({ userid: touserid }, (data: User, error: any) => {
            if (error) return
            let touser = data;
            touser.friendRequests.push(currentuserid)

            usersDb.update({ userid: touser.userid }, { friendRequests: touser.friendRequests }, false, (res: any, err1: any) => {
                if (!err1 || res) response.send({ message: "success" })
            })
        })
    }
})

friendRequestsRoute.post("/acceptfr", async (request, response) => {
    const touserid = request.body.touserid
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.render('signup'); else {
        const currentuser: User | any = await token.getuser(userAuthToken)
        if (currentuser == null || !isUser(currentuser)) return

        if (currentuser.friendRequests.includes(touserid)) {
            const touser = await anyuser.get(touserid)
            if (touser == null || !isUser(touser)) return

            const newfriendchatlog: ChatLog = { log: "Became Friends", time: Date.now() }
            const newchat: Chat = {
                chatid: keygen.chatid(),
                log: newfriendchatlog,
                users: [currentuser, touser],
                messages: []
            }
            const friendship: Friend = {
                userid: touserid,
                chatid: newchat.chatid,
                friendssince: Date.now(),
                wallpaper: "#00000000"
            }
            const friendshipR: Friend = {
                userid: currentuser.userid,
                chatid: newchat.chatid,
                friendssince: Date.now(),
                wallpaper: "#00000000"
            }
            currentuser.friends.push(friendship)
            touser.friends.push(friendshipR)

            chatsDb.insert(newchat, (chatdata: any, err1: any) => {
                if (err1 || !chatdata) return
                usersDb.update(
                    { userid: currentuser.userid },
                    {
                        friends: currentuser.friends,
                        friendRequests: anyuser.deletefriendrequest(currentuser.friendRequests, touserid)
                    }, false,
                    (data: any, error: any) => {
                    if (error) return
                    if (data !== "updated") return
                        
                    usersDb.update({ userid: touserid }, { friends: touser.friends }, false, (data1: any, error1: any) => {
                        if (error1) return
                        if (data1 !== "updated") return
                        response.send({ message: "success" })
                    })
                })
            })
        } else response.send({ message: "fail" })
    }
})