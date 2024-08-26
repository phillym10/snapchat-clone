type Chat = {
    userid: string,
    displayname: string,
    usercolor: string,
    chatid: string
}
type ChatLogs = {
    log: string,
    time: number
}

function isChat(object: any): object is Chat {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.userid === 'string' &&
           typeof object.displayname === 'string' &&
           typeof object.chatid === 'string' &&
           typeof object.usercolor === 'string'
}
function isChatLogs(object: any): object is ChatLogs {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.log === 'string' &&
           typeof object.time === 'number'
}


const friendsList = document.querySelector<HTMLDivElement>("#friends-chat-list")

async function loadFriends() {
    if (friendsList == null || friendsList.innerHTML == null) return
    friendsList.innerHTML = ""
    const friends = await loadUserFriends();
    
    if (!Array.isArray(friends)) return
    if (friends.length > 0) {
        friendsList.innerHTML = ""
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const chatinfo = await getChatInfo(friend.chatid)
            const currentTime = Date.now()
            if (friend == null || !isChat(friend) || !isChatLogs(chatinfo)) continue

            friendsList.innerHTML += chatComponent.friend(friend.chatid, friend.userid, friend.usercolor, friend.displayname, wtime.format(currentTime - chatinfo.time), chatinfo.log)
        }
    } else {
        friendsList.innerHTML = chatComponent.nofriends()
    }
}