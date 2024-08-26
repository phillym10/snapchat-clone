
const userProfileContainer = document.querySelector<HTMLDivElement>("#auserprofile")
const userProfileContainerCloseButton = document.querySelector<HTMLDivElement>("#userprofile-clsbtn")
const userProfileContainerUser = document.querySelector<HTMLDivElement>("#auserprofile-username")
const userProfileContainerTags = document.querySelector<HTMLDivElement>("#auserprofile-tags")
const userProfileContainer_FriendsSince = document.querySelector<HTMLDivElement>("#friends-since")


const removeFriendButton = document.querySelector<HTMLDivElement>("#auserprofile-rmf")
const blockFriendButton = document.querySelector<HTMLDivElement>("#auserprofile-block")
const makeBestFriendButton = document.querySelector<HTMLDivElement>("#auserprofile-mkbsf")


async function openUserProfile(userid: string, chatid: string) {
    if (userProfileContainer == null || userProfileContainerCloseButton == null) return
    if (userProfileContainerUser == null || userProfileContainerTags == null) return
    if (userProfileContainer_FriendsSince == null || removeFriendButton == null) return
    if (blockFriendButton == null || makeBestFriendButton == null) return

    const currentUser: any = await getCurrentUser()
    const user: any = await getUser(userid)
    console.log([currentUser,user])

    userProfileContainerUser.setAttribute("style", `--color: ${user.usercolor}`)
    userProfileContainerUser.innerHTML += user.displayname

    userProfileContainer.classList.add("show")

    userProfileContainerCloseButton.addEventListener("click", () => {
        userProfileContainer.classList.remove("show")
    })
}