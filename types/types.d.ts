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
    reactions: string[],
    saved: true | false,
    replyto: string,
    chatid: string
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
    storyimage: string,
    timeout: number,
    watched: string[]
}

export type UserStory = {
    userid: string,
    stories: Story[]
}

export type Streak = {
    chatid: string,
    lastuser: string,
    time: number,
    streakcount: number,
    date: string
}

export type MiniBio = {
    userid: string,
    emoji: string,
    text: string
}