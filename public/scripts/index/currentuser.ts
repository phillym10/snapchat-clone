const currentUserProfile = document.querySelector<HTMLDivElement>("#currentuserprofile")
const currentUserProfileOpenButton = document.querySelector<HTMLDivElement>("#curretuser-openbtn")
const currentUserProfileCloseButton = document.querySelector<HTMLDivElement>("#curretuser-clsbtn")

const switchThemeButton = document.querySelector<HTMLDivElement>("#switch-main")
const bodyContainer = document.querySelector<HTMLDivElement>("#body-container")

currentUserProfileOpenButton?.addEventListener("click", () => {
    if (currentUserProfile == null) return
    currentUserProfile.classList.add("show")
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
