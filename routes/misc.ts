import express from 'express'
import { bsfsDb, chatsDb, messagesDb, minibioDb, streaksDb, usersDb } from '../include/dbcnf'
import { Chat, Message, Streak, MiniBio, User } from '../types/types'
import { isUser } from '../types/typechecker'
import { keygen } from '../include/keygen'
import { token } from '../include/token'
import { anyuser } from '../include/users'
import { wdate } from '../include/datetime'

export const miscRoute = express.Router()


miscRoute.post("/gettags/:chatid/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const chatid = request.params.chatid
        const currentUser: any = await token.getuser(userAuthToken)
        const checkUser: any = await anyuser.get(userid)

        let user_streak_count: number = 0

        usersDb.findOne({ userid: userid }, (userdata: User, error: any) => {
            if (error) return
            streaksDb.findOne({ chatid: chatid }, (streakdata: Streak, error1: any) => {
                user_streak_count = (streakdata == undefined || streakdata == null) ? 0 : streakdata.streakcount
                bsfsDb.findOne({ userid: currentUser.userid, bsfid: userid }, (data: any, error2: any) => {
                    minibioDb.findOne({ userid: userid }, (minibiodata: MiniBio, error3: any) => {
                        if (error) {
                            response.send({ message: [checkUser.snapscore, user_streak_count, (data == undefined) ? false : true, false] })
                        } else {
                            response.send({ message: [checkUser.snapscore, user_streak_count, (data == undefined) ? false : true, minibiodata] })
                        }
                    })
                })
            })
        })

    }
})

miscRoute.post("/getminibio", (request, response) => {
    const userid = request.body.userid
    minibioDb.findOne({ userid: userid }, (miniBioData: MiniBio, error: any) => {
        if (error) response.send({ message: undefined }); else response.send({ message: miniBioData })
    })
})

miscRoute.post("/makebsf/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const currentUser: any = await token.getuser(userAuthToken)
        bsfsDb.findOne({ userid: currentUser.userid }, (bsfdata: any, error: any) => {
            if (bsfdata == undefined || bsfdata == null) {
                const newBestfriend = { userid: currentUser.userid, bsfid: userid }
                bsfsDb.insert(newBestfriend, (data: any, error: any) => { response.send({ message: data }) })
            } else {
                bsfsDb.update(
                    { userid: currentUser.userid, bsfid: userid },
                    { bsfid: userid }, false, (data: any, err: any) => { response.send({ message: data }) }
                )
            }
        })
    }
})

miscRoute.post("/rmbsf/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const currentUser: any = await token.getuser(userAuthToken)
        bsfsDb.findOne({ userid: currentUser.userid }, (bsfdata: any, error: any) => {
            if (error) return
            bsfsDb.delete(
                { userid: currentUser.userid, bsfid: userid },
                (data: any, err: any) => { response.send({ message: data }) }
            )
        })
    }
})

miscRoute.post("/rmfr/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const chatid = request.body.chatid
        const currentUser: any = await token.getuser(userAuthToken)
        if (!isUser(currentUser)) return

        usersDb.findOne({ userid: currentUser.userid }, (data: User, error: any) => {
            if (error) return
            const newFriendsList = []

            for (let i = 0; i < data.friends.length; i++) {
                const friend = data.friends[i];
                if (friend.userid !== userid) newFriendsList.push(friend)
            }

            usersDb.update(
                { userid: currentUser.userid },
                { friends: newFriendsList }, false, (data: any, error: any) => {
                    if (error) return
                    
                    usersDb.findOne({ userid: userid }, (data1: User, error: any) => {
                        if (error) return
                        const newFriendsList1 = []
            
                        for (let i = 0; i < data1.friends.length; i++) {
                            const friend = data1.friends[i];
                            if (friend.userid !== currentUser.userid) newFriendsList1.push(friend)
                        }
            
                        usersDb.update(
                            { userid: userid },
                            { friends: newFriendsList1 }, false, (data: any, error: any) => {}
                        )
            
                        chatsDb.delete({ chatid: chatid }, (data: any, error: any) => {})
                        
                        response.send({ message: "done" })
                    })
                }
            )
        })
    }
})

miscRoute.post("/blockfr/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const chatid = request.body.chatid
        const currentUser: any = await token.getuser(userAuthToken)
        
        usersDb.findOne({ userid: currentUser.userid }, (data: User, error: any) => {
            if (error) return
            const newFriendsList = []
            const blockedList = data.blockedUsers
            if (!data.blockedUsers.includes(userid)) blockedList.push(userid)

            for (let i = 0; i < data.friends.length; i++) {
                const friend = data.friends[i];
                if (friend.userid !== userid) newFriendsList.push(friend)
            }

            usersDb.update(
                { userid: currentUser.userid },
                { friends: newFriendsList, blockedUsers: blockedList }, false, (data_r: any, error1: any) => {
                    if (error1) return
                    usersDb.findOne({ userid: userid }, (data1: User, error: any) => {
                        if (error) return
                        const newFriendsList1 = []
            
                        for (let i = 0; i < data1.friends.length; i++) {
                            const friend = data1.friends[i];
                            if (friend.userid !== currentUser.userid) newFriendsList1.push(friend)
                        }
            
                        usersDb.update(
                            { userid: userid },
                            { friends: newFriendsList1 }, false, (data: any, error: any) => {}
                        )

                        chatsDb.delete({ chatid: chatid }, (data: any, error: any) => {})
            
                        response.send({ message: "done" })
                    })
                }
            )
        })
    }
})


miscRoute.post("/allblockedusers", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        if (!isUser(currentUser)) return

        const allBlockedUsers = []
        for (let index = 0; index < currentUser.blockedUsers.length; index++) {
            const blockedUserId = currentUser.blockedUsers[index];
            const blockedUser: any = await anyuser.get(blockedUserId)
            if (!isUser(blockedUser)) continue; else allBlockedUsers.push(blockedUser)
        }

        response.send({ message: allBlockedUsers })
    }
})

miscRoute.post("/unblockfr/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const currentUser: any = await token.getuser(userAuthToken)
        if (!isUser(currentUser)) return

        const newBlockedUsers = []
        for (let index = 0; index < currentUser.blockedUsers.length; index++) {
            const blockedUser = currentUser.blockedUsers[index];
            if (blockedUser !== userid) newBlockedUsers.push(blockedUser)
        }
        usersDb.update(
            { userid: currentUser.userid },
            { blockedUsers: newBlockedUsers }, false, (data: any, error: any) => {}
        )

        response.send({ message: "done" })
    }
})

miscRoute.post("/getbsf", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        bsfsDb.findOne({ userid: currentUser.userid }, (bsfdata: any, error: any) => {
            if (error) {
                response.send({ message: "nobsf" })
            } else {
                usersDb.findOne({ userid: bsfdata.bsfid }, (data: User, error1: any) => {
                    if (error1) response.send({ message: "nobsf" })
                    response.send({ message: data })
                })
            }
        })
    }
})

miscRoute.post("/mkminibio", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.body.userid
        const emoji = request.body.emoji
        const text = request.body.text
        const currentUser: any = await token.getuser(userAuthToken)
        minibioDb.findOne({ userid: userid }, (data: any, err: any) => {
            if (err) {
                const newMiniBio: MiniBio = {
                    userid: currentUser.userid,
                    emoji: emoji,
                    text: text
                }
                minibioDb.insert(newMiniBio, (data: any, error: any) => response.send({ message: "done" }))
            } else {
                minibioDb.update(
                    { userid: userid },
                    { emoji: emoji, text: text }, false, (data: any, error: any) => response.send({ message: "done" })
                )
            }
        })
    }
})