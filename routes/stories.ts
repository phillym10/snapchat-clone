import express from 'express'
import { token } from '../include/token';
import { storiesDb, usersDb } from '../include/dbcnf';
import { isUser } from '../types/typechecker';
import { UserStory } from '../types/types';

export const storyRoute = express.Router()

storyRoute.post("/feedstories", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        if (!isUser(currentUser)) return

        const friendsWithStories: any[] = []
        for (let i = 0; i < currentUser.friends.length; i++) {
            const userFriend = currentUser.friends[i]
            storiesDb.findOne({ userid: userFriend.userid }, (userdata: User, error: any) => {
                if (!error) friendsWithStories.push(userdata)
            })
        }

        response.send({ message: friendsWithStories })
    }
})

storyRoute.post("/getstory/:userid", async (request, response) => {
    const userid = request.params.userid
    storiesDb.findOne({ userid: userid }, (storydata: UserStory, error: any) => {
        if (!error) response.send({ message: storydata }); else response.send({ message: "error" })
    })
})
