
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

    const chatInfo: any = await getChat(chatid)
    const user: any = await getUser(userid)
    const chatTags: any = await getChatTags(chatid, userid)
    if (!Array.isArray(chatTags)) return

    userProfileContainerTags.innerHTML = aUserProfileComponents.snapscoreTag(number$.format(chatTags[0]))
    if (chatTags[1] > 0) userProfileContainerTags.innerHTML += aUserProfileComponents.streakTag(number$.format(chatTags[1]))

    userProfileContainerTags.innerHTML += (chatTags[3] == false || chatTags[3] == null)
    ? miniBioComponent.load("👋", "no mini bio yet", "")
    : miniBioComponent.load(chatTags[3].emoji, chatTags[3].text, "")

    if (chatTags[2] == true) {
        makeBestFriendButton.innerHTML = "Remove Best Friend"
        userProfileContainerTags.innerHTML += aUserProfileComponents.bsfTag
    } else makeBestFriendButton.innerHTML = "Make Best Friend"

    userProfileContainer_FriendsSince.innerHTML = chatInfo.date
    userProfileContainerUser.setAttribute("style", `--color: ${user.usercolor}`)
    userProfileContainerUser.innerHTML = `<i class="fa-solid fa-user"></i> ${user.displayname}`

    userProfileContainer.classList.add("show")

    makeBestFriendButton.addEventListener("click", async () => {
        if (chatTags[2] == true) {
            userProfileContainer.classList.remove("show")
            await removeBestFriend(userid)
        } else {
            userProfileContainerTags.innerHTML += aUserProfileComponents.bsfTag
            await makeBestFriend(userid)
        }
    })

    userProfileContainerCloseButton.addEventListener("click", () => {
        userProfileContainer.classList.remove("show")
    })
}