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

        let user_streak_count: number = 0

        usersDb.findOne({ userid: userid }, (userdata: User, error: any) => {
            if (error) return
            streaksDb.findOne({ chatid: chatid }, (streakdata: Streak, error1: any) => {
                user_streak_count = (streakdata == undefined || streakdata == null) ? 0 : streakdata.streakcount
                bsfsDb.findOne({ userid: currentUser.userid, bsfid: userid }, (data: any, error2: any) => {
                    response.send({ message: [checkUser.snapscore, user_streak_count, (data == undefined) ? false : true] })
                })
            })
        })

    }
})

miscRoute.post("/makebsf/:userid", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const userid = request.params.userid
        const currentUser: any = await token.getuser(userAuthToken)
        bsfsDb.findOne({ userid: currentUser.userid }, (bsfdata: any, error: any) => {
            if (error) return
            if (bsfdata == undefined || bsfdata == null) {
                const newBestfriend = { userid: currentUser.userid, bsfid: userid }
                bsfsDb.insert(newBestfriend, (data: any, error: any) => {})
            } else {
                bsfsDb.update(
                    { userid: currentUser.userid, bsfid: userid },
                    { bsfid: userid }, false, (data: any, err: any) => {}
                )
            }
        })
    }
})