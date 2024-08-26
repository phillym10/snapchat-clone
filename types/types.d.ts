export type User = {
    userid: string,
    userauthtoken: string,
    displayname: string,
    username: string,
    password: string,
    usercolor: string,
    friends: Friend[],
    friendRequests: string[],
    snapscore: number,
    blockedUsers: string[],
    closeFriend: object | string | any,
    verified: boolean
}

export type Friend = {
    userid: string,
    chatid: string,
    friendssince: number,
    wallpaper: string
}

export type Message = {
    messageid: string,
    messagetimeout: number,
    type: "chat" | "snap" | "deleted",
    userid: string,
    chat?: string,
    snap?: string,
    opened?: true | false,
    time: number,
    reactions: Reaction[],
    saved: true | false,
    replyto: string,
    chatid: string
}

export type Reaction = {
    reaction: string,
    animation: "throb" | "grow"
}

export type ChatLog = {
    log: string,
    userid: string,
    time: number
}

export type Chat = {
    chatid: string,
    log: ChatLog,
    users: User[],
    messages: string[],
    date: string
}

export type GroupChat = {
    gchatid: string,
    log: ChatLog,
    users: User[],
    messages: string[]
}

export type Story = {
    storyid: string,
    userid: string,
    storyimage: string,
    texts: string[],
    timeout: number
}

export type Streak = {
    chatid: string,
    lastuser: string,
    time: number,
    streakcount: number,
    date: string
}