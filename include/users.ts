import { User } from "../types/types"
import { usersDb } from "./dbcnf"

export const anyuser = {
    get: (userid: string) => {
        return new Promise((resolve) => {
            usersDb.findOne({userid: userid}, (data: User, error: any) => {
                if (!error && data) resolve(data); else resolve(false)
            })
        })
    },
    deletefriendrequest: (frqsts: any[], remValue: any) => {
        const newArray = []
        for (let i = 0; i < frqsts.length; i++) {
            if (frqsts[i] !== remValue) newArray.push(frqsts[i])
        }
        return newArray
    }
}

export const friendship = {
    check: (userid1: string, userid2: string) => {
        return new Promise((resolve) => {
            usersDb.findOne({ userid: userid1 }, (user1: User, error: any) => {
                if (error) return
                usersDb.findOne({ userid: userid2 }, (user2: User, error2: any) => {
                    if (error2) return
                    const friends = user1.friends
                    const friends2 = user2.friends

                    let areFriends = "false"
                    
                    friends.forEach((friend) => {
                        if (friend.userid === user2.userid) areFriends = "true"
                    })
                    friends2.forEach((friend) => {
                        if (friend.userid === user1.userid) areFriends = "true"
                    })
                    resolve(areFriends)
                })
            })
        })
    }
}