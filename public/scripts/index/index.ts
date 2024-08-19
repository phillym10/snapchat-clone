type FullUser = {
    userid: string,
    userauthtoken: string,
    displayname: string,
    username: string,
    password: string,
    usercolor: string,
    friends: any[],
    friendRequests: string[],
    blockedUsers: string[],
    closeFriend: object | string | any,
    verified: boolean
}
function isFullUser(object: any): object is FullUser {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.userid === 'string' &&
           typeof object.userauthtoken === 'string' &&
           typeof object.displayname === 'string' &&
           typeof object.username === 'string' &&
           typeof object.password === 'string' &&
           typeof object.usercolor === 'string' &&
           typeof object.friends === 'object' &&
           typeof object.friendRequests === 'object' &&
           (typeof object.closeFriend === 'string' || typeof object.closeFriend === 'object') &&
           typeof object.verified === 'boolean'
}



async function allOnloadFunctions() {
    await loadFriends()
    const numberoffrElement = document.querySelector<HTMLDivElement>("#number-offr")
    const userColorProfile = document.querySelector<HTMLDivElement>("#curretuser-openbtn")
    if (numberoffrElement == null || userColorProfile == null) return

    const currentUser: User | any = await getCurrentUser()
    if (!isFullUser(currentUser)) return
    numberoffrElement.style.display = (currentUser.friendRequests.length < 1) ? "none" : "flex";
    numberoffrElement.innerHTML = `${(currentUser.friendRequests.length > 9) ? "9+" : currentUser.friendRequests.length}`;
    userColorProfile.setAttribute("style", `--color: ${currentUser.usercolor}`)

    const findNewFriendsButton = document.querySelector<HTMLButtonElement>("#openFriendRequestsModal")
    findNewFriendsButton?.addEventListener("click", loadFriendRequests)
}

document.addEventListener("DOMContentLoaded", async () => { await allOnloadFunctions(); })