

const chatContainer = document.querySelector<HTMLDivElement>("#chat")
const chatContainerCloseButton = document.querySelector<HTMLDivElement>("#chat-clsbtn")
const messageInputBox = document.querySelector<HTMLInputElement>("#chatbox-message")
const chatUserName = document.querySelector<HTMLDivElement>("#chat-profilename")
const chatUserIcon = document.querySelector<HTMLDivElement>("#chat-usricon")

const chatSnapButton = document.querySelector<HTMLDivElement>("#chats-msgbox-snap")

const chatBox = document.querySelector<HTMLDivElement>("#chats-chatspace")
let messagesHandler: any = null;
let lastMessage: any = null;

function checkIfMessagesAreEqual (message1: any, message2: any) {
    return (
        typeof message1 === "object" &&
        typeof message2 === "object" &&
        message1.userid === message2.userid &&
        message1.chat === message2.chat &&
        message1.chatid === message2.chatid &&
        message1.messageid === message2.messageid &&
        message1.messagetimeout === message2.messagetimeout &&
        message1.reactions.length === message2.reactions.length &&
        message1.replyto === message2.replyto &&
        message1.saved === message2.saved &&
        message1.snap === message2.snap &&
        message1.time === message2.time &&
        message1.type === message2.type
    )
}

async function loadChatMessages(chatid: string) {
    if (chatBox == null) return
    const currentUser: any = await getCurrentUser()
    const chatMessages: any = await getChatMessages(chatid)

    if (chatMessages.length > 0 && lastMessage !== undefined) {
        const chat_message = chatMessages[chatMessages.length-1]
        if (!checkIfMessagesAreEqual(lastMessage, chat_message)) {
            const chat_message_owner: any = await getUser(chat_message.userid)
            chat_message_owner.displayname = (currentUser.displayname == chat_message_owner.displayname) ? "me" : chat_message_owner.displayname
            if (lastMessage.userid !== chat_message_owner.userid && (lastMessage.replyto == "" || lastMessage.replyto == null)) {
                if (chat_message.type == "snap") {
                } else {
                    chatBox.innerHTML += messageComponent.message(chat_message_owner.usercolor, chat_message_owner.displayname, chat_message.chat)
                }
            } else {
                if (chat_message.type == "snap") {
                } else {
                    chatBox.innerHTML += messageComponent.continueMsg(chat_message_owner.usercolor, chat_message_owner.displayname, chat_message.chat)
                }
            }
        }
        lastMessage = chat_message
    }
}

async function initialLoadingMessages(chatid: string) {
    if (chatBox == null) return
    const currentUser: any = await getCurrentUser()
    const chatMessages: any = await getChatMessages(chatid)

    if (chatMessages.length > 0) {
        for (let i = 0; i < chatMessages.length; i++) {
            const chat_message = chatMessages[i];
            const chat_message_owner: any = await getUser(chat_message.userid)
            chat_message_owner.displayname = (currentUser.displayname == chat_message_owner.displayname) ? "me" : chat_message_owner.displayname

            if (i == 0) {
                chatBox.innerHTML += messageComponent.message(chat_message_owner.usercolor, chat_message_owner.displayname, chat_message.chat)
            } else {
                const lastMessage = chatMessages[i-1];
                if (lastMessage.userid !== chat_message_owner.userid && (lastMessage.replyto == "" || lastMessage.replyto == null)) {
                    if (chat_message.type == "snap") {
                    } else {
                        chatBox.innerHTML += messageComponent.message(chat_message_owner.usercolor, chat_message_owner.displayname, chat_message.chat)
                    }
                } else {
                    if (chat_message.type == "snap") {
                    } else {
                        chatBox.innerHTML += messageComponent.continueMsg(chat_message_owner.usercolor, chat_message_owner.displayname, chat_message.chat)
                    }
                }
            }
        }
    }
    lastMessage = await getLastMessage(chatid)
}

async function openChat(chatid: string, userid: string) {
    if (messageInputBox == null || chatContainer == null) return
    if (chatUserName == null || chatUserIcon == null) return
    if (chatBox == null || chatSnapButton == null) return
    const chatUser: any = await getUser(userid)
    chatBox.innerHTML = ""

    chatUserName.innerHTML = chatUser.displayname
    chatUserIcon.setAttribute("style", `--color: ${chatUser.usercolor};`)
    chatContainer.animate([{ transform: "translateX(0)" }], { duration: 200, iterations: 1, fill: "forwards" })
    messageInputBox.focus()

    await initialLoadingMessages(chatid)
    messagesHandler = setInterval(async () => { await loadChatMessages(chatid) }, 100)

    messageInputBox.addEventListener("keyup", async (event) => {
        event.preventDefault()
        const message = messageInputBox.value
        if (event.keyCode == 13 && message !== "") {
            messageInputBox.value = ""
            await sendMessage(chatid, message, "chat", "")
        }
    })

    chatSnapButton.addEventListener("click", () => {
        sendASnap(userid)
    })
}

chatContainerCloseButton?.addEventListener("click", () => {
    clearInterval(messagesHandler)
    chatContainer?.animate([{ transform: "translateX(-100%)" }], { duration: 200, iterations: 1, fill: "forwards" })
})