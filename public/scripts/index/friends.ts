type Chat = {
    userid: string,
    displayname: string,
    usercolor: string
}

function isChat(object: any): object is Chat {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.userid === 'string' &&
           typeof object.displayname === 'string' &&
           typeof object.usercolor === 'string'
}

const friendsList = document.querySelector<HTMLDivElement>("#friends-chat-list")

async function loadFriends() {
    if (friendsList == null || friendsList.innerHTML == null) return
    const friends = await loadUserFriends();
    
    if (!Array.isArray(friends)) return
    for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        if (friend == null || !isChat(friend)) continue
        friendsList.innerHTML += chatComponent.friend(friend.usercolor, friend.displayname, "Delivered")
    }
}

window.onload = async () => { await loadFriends() }