import express, { urlencoded } from 'express'
import { usersDb } from '../include/dbcnf'
import { token } from '../include/token'
import { anyuser, friendship } from '../include/users'
import { User, Friend } from '../types/types'
import { isUser } from '../types/typechecker'

export const friendsRoute = express.Router()


friendsRoute.post("/allfriends", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/signup'); else {
        const currentUser = await token.getuser(userAuthToken)
        const friends: any[] = []
        if (currentUser == null || !isUser(currentUser)) return

        for (let i = 0; i < currentUser.friends.length; i ++) {
            const friend: User | any = await anyuser.get(currentUser.friends[i].userid)
            if (friend == null || !isUser(friend)) return

            friends.push({
                userid: currentUser.friends[i].userid,
                displayname: friend.displayname,
                usercolor: friend.usercolor
            })
        }
        response.send({ message: friends })
    }
})