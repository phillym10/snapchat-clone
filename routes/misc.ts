import express from 'express'
import { User } from '../types/types'
import { bsfsDb, chatsDb, messagesDb, streaksDb, usersDb } from '../include/dbcnf'
import { Chat, Message, Streak } from '../types/types'
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

        usersDb.findOne({ userid: userid }, (userdata: User, error: any) => {
            if (error) return
            streaksDb.findOne({ chatid: chatid }, (streakdata: Streak, error1: any) => {
                if (error1) return
                bsfsDb.findOne({ userid: currentUser.userid, bsfid: userid }, (data: any, error2: any) => {
                    if (error2) return
                    response.send({ message: [checkUser.snapscore, streakdata.streakcount, (data == undefined) ? false : true] })
                })
            })
        })

    }
})