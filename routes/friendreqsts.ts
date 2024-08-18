import express from 'express'
import { usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { anyuser, friendship } from '../include/users'
import { User, Friend } from '../types/types'
import { isUser } from '../types/typechecker'

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

            const friendship: Friend = {
                userid: touserid,
                messages: [],
                friendssince: Date.now(),
                wallpaper: "#00000000"
            }
            const friendshipR: Friend = {
                userid: currentuser.userid,
                messages: [],
                friendssince: Date.now(),
                wallpaper: "#00000000"
            }
            currentuser.friends.push(friendship)
            touser.friends.push(friendshipR)


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
                    response.send({ message: `Accepted Friend Request from ${touser.username}` })
                })
            })
        } else response.send({ message: "fail" })
    }
})

friendRequestsRoute.post("/requests", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.render('signup'); else {
        const currentuserid = await token.getkey(userAuthToken, "userid")
        usersDb.findOne({ userid: currentuserid }, (currentUser: User, err: any) => {
            if (err) return
            const frqsts: User[] = []
            for (let i = 0; i < currentUser.friendRequests.length; i++) {
                usersDb.findOne({ userid: currentUser.friendRequests[i] }, (data: User, error: any) => {
                    if (error) return
                    frqsts.push(data)
                })
            }

            response.send({ message: frqsts })
        })
    }
})
