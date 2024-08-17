type User = {
    userid: string,
    userauthtoken: string,
    displayname: string,
    username: string,
    password: string,
    usercolor: string,
    friends: Friend[],
    friendRequests: FriendRequest[],
    blockedUsers: string[],
    closeFriend: object | string | any,
    verified: true | false,
    mode: "light" | "dark"
}

type Friend = {
    userid: string,
    messages: any[],
    friendssince: string,
    wallpaper: string
}

type Message = {
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

type FriendRequest = {
    userid: string,
    requesting: string,
    accepted: true | false
}

type Reaction = {
    reaction: string,
    animation: "throb" | "grow"
}

type ChatLog = {
    log: string,
    time: number
}

type Chat = {
    chatid: string,
    log: ChatLog,
    users: User[],
    messages: Message[]
}

type GroupChat = {
    gchatid: string,
    log: ChatLog,
    users: User[],
    messages: Message[]
}

type Story = {
    userid: string,
    storyimage: string,
    texts: string[],
    timeout: number
}