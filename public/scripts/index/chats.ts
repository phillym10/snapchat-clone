

const chatContainer = document.querySelector<HTMLDivElement>("#chat")
const chatContainerCloseButton = document.querySelector<HTMLDivElement>("#chat-clsbtn")
const messageInputBox = document.querySelector<HTMLInputElement>("#chatbox-message")

async function openChat(chatid: string) {
    if (messageInputBox == null) return
    chatContainer?.animate([{ transform: "translateX(0)" }], { duration: 200, iterations: 1, fill: "forwards" })
    messageInputBox.focus()
}

chatContainerCloseButton?.addEventListener("click", () => {
    chatContainer?.animate([{ transform: "translateX(-100%)" }], { duration: 200, iterations: 1, fill: "forwards" })
})