const contextmenumodal = document.querySelector<HTMLDivElement>("#context-menu-modal")
const contextmenu = document.querySelector<HTMLDivElement>("#context-menu")

function chatContextMenu(element: HTMLElement, event: Event, messageid: string) {
    if (contextmenumodal == null || contextmenu == null) return
    event.preventDefault()
    contextmenumodal.classList.add("show")

    const reactions = ['🤣', '😡', '👍', '👎', '💀']
    const saveInChatBtn = document.querySelector<HTMLDivElement>("#ctxtmenu-savebtn")
    const copyButton = document.querySelector<HTMLDivElement>("#ctxtmenu-copybtn")
    const editMessageBtn = document.querySelector<HTMLDivElement>("#ctxtmenu-editbtn")
    const replyButton = document.querySelector<HTMLDivElement>("#ctxtmenu-replybtn")
    const deleteChatButton = document.querySelector<HTMLDivElement>("#ctxtmenu-deletebtn")

    document.addEventListener("click", (event: any) => {
        if (!contextmenu.contains(event.target)) contextmenumodal.classList.remove("show")
    })

    saveInChatBtn?.addEventListener("click", () => {
        toggleSaveMsg(element.children[0], messageid)
        contextmenumodal.classList.remove("show")
    })

    copyButton?.addEventListener("click", () => {
        const message = element.children[0].innerHTML
        navigator.clipboard.writeText(message).then(() => {
            contextmenumodal.classList.remove("show")
        })
    })

    editMessageBtn?.addEventListener("click", () => {
        const message = element.children[0].innerHTML
        ModalController.inputmodal("Edit Message", "New Message", message, async (value: string) => {
            await editMessage(messageid, value)
            contextmenumodal.classList.remove("show")
        })
    })

    replyButton?.addEventListener("click", async () => {
        const replyMessageBox = document.querySelector<HTMLDivElement>("#replytomsg")
        const replyMessageBoxUsername = document.querySelector<HTMLDivElement>("#replytomsg-username")
        const replyMessageBoxMessage = document.querySelector<HTMLDivElement>("#replytomsg-msg")

        if (replyMessageBox == null || replyMessageBoxMessage == null) return
        if (replyMessageBoxUsername == null || chatContainer == null) return

        const reply_message: any = await getMessage(messageid)
        const reply_message_owner: any = await getUser(reply_message.userid)

        replyMessageBox.setAttribute("style", `--profcolor: ${reply_message_owner.usercolor};`)
        replyMessageBoxUsername.innerHTML = reply_message_owner.displayname
        replyMessageBoxMessage.innerHTML = reply_message.chat
        chatContainer.setAttribute("replyto", messageid)

        replyMessageBox.classList.add("show")
        contextmenumodal.classList.remove("show")
    })

    deleteChatButton?.addEventListener("click", () => {
        ModalController.yesornomodal("Delete Message", "Are you sure you want to delete this message?", "danger", async () => {
            if (chatBox == null) return
            chatBox.innerHTML = ""
            await deleteMessage(messageid)
            contextmenumodal.classList.remove("show")
        })
    })
}