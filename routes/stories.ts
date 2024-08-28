import express from 'express'
import { token } from '../include/token';
import { storiesDb, usersDb } from '../include/dbcnf';
import { isUser } from '../types/typechecker';
import { Story, UserStory } from '../types/types';
import path from 'path';
import fs from 'fs';
import { keygen } from '../include/keygen';

export const storyRoute = express.Router()

async function saveStory (base64: string, storyid: string) {
    let base64Data = base64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    // get extension
    const match = base64.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    let extension = ""
    if (match && match[1]) extension = match[1]; // "png", "jpeg", "gif", etc.

    // validate base64 data and get all necessary data
    const paddedBase64 = base64Data.padEnd(base64.length + (4 - (base64Data.length % 4)) % 4, '=');
    const buffer = Buffer.from(paddedBase64, 'base64');
    const filename = `${storyid}.${extension}`;
    const filepath = path.join('public', 'stories', filename)

    // check if user already has a profile picture
    const profilePictures = fs.readdirSync(path.join('public', 'stories'))
    const existingUserProfilePicture = profilePictures.find(file => path.parse(file).name === storyid)

    if (existingUserProfilePicture) {
        const existingUserProfilePicturePath = path.join('public', 'stories', existingUserProfilePicture);
        fs.unlinkSync(existingUserProfilePicturePath)
        fs.writeFileSync(filepath, buffer);
    } else fs.writeFileSync(filepath, buffer);

    return filename
}

storyRoute.post("/addStory", async (request, response) => {
    const storyimg = request.body.storyimg
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        if (!isUser(currentUser)) return

        const storyId = keygen.storyid()
        const story: Story = {
            storyid: storyId,
            storyimage: await saveStory(storyimg, storyId),
            timeout: Date.now(),
            watched: []
        }

        storiesDb.findOne({ userid: currentUser.userid }, (data: UserStory, error:any) => {
            if (error) {
                const newStory: UserStory = {
                    userid: currentUser.userid,
                    stories: [story]
                }
                storiesDb.insert(newStory, (storydata: any, error1: any) => {})
            } else {
                let user_story = data
                user_story.stories.push(story)
                storiesDb.update(
                    { userid: currentUser.userid },
                    { stories: user_story.stories }, false, (storydata: any, error1: any) => {}
                ) 
            }
        })
    }
})

storyRoute.post("/deleteStory", async (request, response) => {
    const userAuthToken = token.auth(request)
    if (userAuthToken == undefined || userAuthToken == "" || userAuthToken == null) response.redirect('/login'); else {
        const currentUser: any = await token.getuser(userAuthToken)
        const storyid = request.body.storyid
        if (!isUser(currentUser)) return

        storiesDb.findOne({ userid: currentUser.userid }, (userstorydata: UserStory, error: any) => {
            if (error) return
            let userStory_data = userstorydata
            const newStories: any[] = []

            for (let i = 0; i < userStory_data.stories.length; i++) {
                const story = userStory_data.stories[i];
                if (story.storyid !== storyid) newStories.push(story)
            }

            storiesDb.update(
                { userid: currentUser.userid },
                { stories: newStories }, false, (data: any, error: any) => response.send({ message: newStories })
            )
        })
    }
})

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


storyRoute.post("/viewstory", async (request, response) => {
    const owneruserid = request.body.owneruserid
    const storyid = request.body.storyid
    const currentUserId = request.body.currentUserId

    storiesDb.findOne({ userid: owneruserid }, (storydata: UserStory, error: any) => {
        if (!error) {
            let storyData = storydata
            for (let i = 0; i < storyData.stories.length; i++) {
                const story = storyData.stories[i];
                if (story.storyid == storyid && !storyData.stories[i].watched.includes(currentUserId)) {
                    storyData.stories[i].watched.push(currentUserId)
                    storiesDb.update(
                        { userid: owneruserid },
                        { stories: storyData.stories }, false, (data: any, error: any) => {}
                    )
                    break;
                }
            }
            response.send({ message: "success" })
        } else response.send({ message: "error" })
    })
})

storyRoute.post("/getstories/:userid", async (request, response) => {
    const userid = request.params.userid
    storiesDb.findOne({ userid: userid }, (storydata: UserStory, error: any) => {
        if (!error) response.send({ message: storydata }); else response.send({ message: "error" })
    })
})

storyRoute.post("/getstory/:userid/:storyid", async (request, response) => {
    const userid = request.params.userid
    const storyid = request.params.storyid
    storiesDb.findOne({ userid: userid }, (storydata: UserStory, error: any) => {
        if (!error) {
            let story_selected: any = "error"
            for (let i = 0; i < storydata.stories.length; i++) {
                const story = storydata.stories[i];
                if (story.storyid == storyid) {
                    story_selected = story
                    break;
                }
            }   
            response.send({ message: story_selected });
        } else response.send({ message: "error" })
    })
})
