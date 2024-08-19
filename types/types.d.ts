export type User = {
    userid: string,
    userauthtoken: string,
    displayname: string,
    username: string,
    password: string,
    usercolor: string,
    friends: Friend[],
    friendRequests: string[],
    blockedUsers: string[],
    closeFriend: object | string | any,
    verified: boolean,
    mode: "light" | "dark"
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
    chat?: string,
    snap?: string,
    time: number,
    reactions: Reaction[],
    saved: true | false,
    replyto: string,
    maxlength: number,
    chatid?: string
}

export type Reaction = {
    reaction: string,
    animation: "throb" | "grow"
}

export type ChatLog = {
    log: string,
    time: number
}

export type Chat = {
    chatid: string,
    log: ChatLog,
    users: User[],
    messages: Message[]
}

export type GroupChat = {
    gchatid: string,
    log: ChatLog,
    users: User[],
    messages: Message[]
}

export type Story = {
    storyid: string,
    userid: string,
    storyimage: string,
    texts: string[],
    timeout: number
}