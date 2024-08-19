type User = {
    displayname: string,
    username: string,
    usercolor: string,
    verified: boolean
}
function isUser(object: any): object is User {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.displayname === 'string' &&
           typeof object.username === 'string' &&
           typeof object.usercolor === 'string' &&
           typeof object.verified === 'boolean'
}

const currentUserProfile = document.querySelector<HTMLDivElement>("#currentuserprofile")
const currentUserProfileOpenButton = document.querySelector<HTMLDivElement>("#curretuser-openbtn")
const currentUserProfileCloseButton = document.querySelector<HTMLDivElement>("#curretuser-clsbtn")

const switchThemeButton = document.querySelector<HTMLDivElement>("#switch-main")
const bodyContainer = document.querySelector<HTMLDivElement>("#body-container")

const userIconElement = document.querySelector<HTMLDivElement>("#cup-usericon")
const userDNameElement = document.querySelector<HTMLDivElement>("#cup-dname")
const userNameElement = document.querySelector<HTMLDivElement>("#cup-username")
const userVerifiedTextElement = document.querySelector<HTMLDivElement>("#cup-vtxt")

currentUserProfileOpenButton?.addEventListener("click", async () => {
    if (currentUserProfile == null) return
    currentUserProfile.classList.add("show")
    
    if (userDNameElement == null || userIconElement == null) return
    if (userNameElement == null || userVerifiedTextElement == null) return

    const currentUser = await getCurrentUser()
    if (currentUser == undefined) return
    if (!isUser(currentUser)) return

    userIconElement.setAttribute("style", `--color: ${currentUser.usercolor}`)
    userDNameElement.innerHTML = currentUser.displayname
    userNameElement.innerHTML = currentUser.username
    userVerifiedTextElement.innerHTML = (currentUser.verified) 
    ? "You are a verified user !" : "You are not a verified user !"
})

userDNameElement?.addEventListener("click", async () => {
    const currentUser = await getCurrentUser()
    if (currentUser == undefined) return
    if (!isUser(currentUser)) return
    ModalController.inputmodal("Display Name", "New Display Name below", currentUser.displayname, (value: any) => {
        alert(value)
    })
})

userNameElement?.addEventListener("click", async () => {
    const currentUser = await getCurrentUser()
    if (currentUser == undefined) return
    if (!isUser(currentUser)) return
    ModalController.inputmodal("Username", "New Username below", currentUser.username, (value: any) => {
        alert(value)
    })
})

userIconElement?.addEventListener("click", async () => {
    const currentUser = await getCurrentUser()
    if (currentUser == undefined) return
    if (!isUser(currentUser)) return
    ModalController.colorSlidermodal((value: any) => alert(value))
})

switchThemeButton?.addEventListener("click", () => {
    if (bodyContainer == null) return

    switchThemeButton.classList.toggle("tgl")
    switchThemeButton.innerHTML = (switchThemeButton.classList.contains("tgl"))
    ? `<i class="bi bi-moon-fill"></i> Dark` : `<i class="bi bi-brightness-high"></i> Light`;
    const theme = (switchThemeButton.classList.contains("tgl"))
    ? `dark` : `light`;
    bodyContainer.setAttribute("theme", theme)
})

currentUserProfileCloseButton?.addEventListener("click", () => {
    if (currentUserProfile == null) return
    currentUserProfile.classList.remove("show")
})
