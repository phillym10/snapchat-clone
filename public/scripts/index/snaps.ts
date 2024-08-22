const sendSnap = document.querySelector<HTMLDivElement>("#send-snap")
const sendSnapCloseButton = document.querySelector<HTMLDivElement>("#send-snap-clsbtn")
const sendSnapUser = document.querySelector<HTMLDivElement>("#send-snap-username")
const sendSnapFileInput = document.querySelector<HTMLInputElement>("#send-snapfile")

const previewSnap = document.querySelector<HTMLDivElement>("#preview-send-snap")
const previewSnapCloseButton = document.querySelector<HTMLDivElement>("#preview-send-snap-closebtn")
const previewSnapUser = document.querySelector<HTMLDivElement>("#preview-send-snap-usrname")
const previewSnapImage = document.querySelector<HTMLDivElement>("#preview-send-snap-image")
const previewSnapSendIcon = document.querySelector<HTMLDivElement>("#preview-send-snap-sendicon")

const viewSnap = document.querySelector<HTMLDivElement>("#view-snap")
const viewSnapImage = document.querySelector<HTMLDivElement>("#view-snap-image")
const viewSnapUserName = document.querySelector<HTMLDivElement>("#view-snap-username")
const viewSnapUserIcon = document.querySelector<HTMLDivElement>("#view-snap-usericon")

viewSnapImage?.addEventListener("click", () => {
    if (viewSnap == null) return
    viewSnap.classList.remove("show")
})

sendSnapCloseButton?.addEventListener("click", () => {
    if (sendSnap == null) return
    sendSnap.classList.remove("show")
})

previewSnapCloseButton?.addEventListener("click", () => {
    if (previewSnap == null) return
    previewSnap.classList.remove("show")
})

async function openSnap(element: HTMLElement, messageid: string) {
    if (viewSnap == null || viewSnapImage == null) return
    if (viewSnapUserName == null || viewSnapUserIcon == null) return
    if (element == null) return
    console.log("opening snap")

    const messageSnap: any = await getMessageSnap(messageid)
    const messageSnapOwner: any = await getMessageSnapOwner(messageid)

    element.setAttribute("onclick", "")
    element.innerHTML = `<i class="fa-regular fa-square"></i> Opened`
    viewSnapImage.setAttribute("src", messageSnap.snap)
    viewSnapUserName.innerHTML = messageSnapOwner.displayname
    viewSnapUserIcon.setAttribute("style", `--profcolor:${messageSnapOwner.usercolor};`)
    viewSnap.classList.add("show")
}

function previewASnap(chatid: string, receiver_username: string, receiver_userid: string, imgsrc: string) {
    if (sendSnap == null) return
    if (previewSnap == null || previewSnapUser == null) return
    if (previewSnapSendIcon == null || previewSnapImage == null) return
    previewSnap.classList.add("show")
    previewSnapUser.innerHTML = receiver_username
    previewSnapUser.setAttribute("userid", receiver_userid)
    previewSnapImage.setAttribute("src", imgsrc)

    previewSnapUser.addEventListener("click", async () => {
        await sendMessage(chatid, imgsrc, "snap", "")
        previewSnap.classList.remove("show")
        sendSnap.classList.remove("show")
    })
    previewSnapSendIcon.addEventListener("click", async () => {
        await sendMessage(chatid, imgsrc, "snap", "")
        previewSnap.classList.remove("show")
        sendSnap.classList.remove("show")
    })
}

async function sendASnap(chatid: string, receiver_userid: string) {
    if (sendSnap == null || sendSnapFileInput == null || sendSnapUser == null) return
    const receivingUser: any = await getUser(receiver_userid)
    sendSnapUser.innerHTML = receivingUser.displayname
    sendSnap.classList.add("show")
    sendSnapFileInput.addEventListener("change", (event: any) => {
        if (event == null || event.target == null) return
        const file = event.target.files[0];

        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e: any) => {
            previewASnap(chatid, receivingUser.displayname, receiver_userid, e.target.result)
            sendSnapFileInput.value = ""
        }
        reader.readAsDataURL(file);
    })    
}