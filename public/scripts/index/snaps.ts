const sendSnap = document.querySelector<HTMLDivElement>("#send-snap")
const sendSnapCloseButton = document.querySelector<HTMLDivElement>("#send-snap-clsbtn")
const sendSnapUser = document.querySelector<HTMLDivElement>("#send-snap-username")
const sendSnapFileInput = document.querySelector<HTMLInputElement>("#send-snapfile")

const previewSnap = document.querySelector<HTMLDivElement>("#preview-send-snap")
const previewSnapCloseButton = document.querySelector<HTMLDivElement>("#preview-send-snap-closebtn")
const previewSnapUser = document.querySelector<HTMLDivElement>("#preview-send-snap-usrname")
const previewSnapImage = document.querySelector<HTMLDivElement>("#preview-send-snap-image")

sendSnapCloseButton?.addEventListener("click", () => {
    if (sendSnap == null) return
    sendSnap.classList.remove("show")
})

previewSnapCloseButton?.addEventListener("click", () => {
    if (previewSnap == null) return
    previewSnap.classList.remove("show")
})

function previewASnap(receiver_username: string, receiver_userid: string, imgsrc: string) {
    if (previewSnap == null || previewSnapUser == null || previewSnapImage == null) return
    previewSnap.classList.add("show")
    previewSnapUser.innerHTML = receiver_username
    previewSnapUser.setAttribute("userid", receiver_userid)
    previewSnapImage.setAttribute("src", imgsrc)
}

async function sendASnap(receiver_userid: string) {
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
            previewASnap(receivingUser.displayname, receiver_userid, e.target.result)
        }
        reader.readAsDataURL(file);
    })    
}