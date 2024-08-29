const frComponent = {
    person: (color: string, displayname: string, username: string, userid: string) => {
        let component = `
        <div class="person">
            <div class="user-profile" style="--color: ${color};"><i class="fa-solid fa-user"></i></div>
            <div class="userinfo">
                <div class="name">${displayname}</div>
                <div class="username">${username}</div>
            </div>
            <button class="default" style="--fs: 1rem;" onclick="addFriend(\'${userid}\')">Add</button>
        </div>`;
        return component
    },
    personSent: (color: string, displayname: string, username: string, userid: string) => {
        let component = `
        <div class="person">
            <div class="user-profile" style="--color: ${color};"><i class="fa-solid fa-user"></i></div>
            <div class="userinfo">
                <div class="name">${displayname}</div>
                <div class="username">${username}</div>
            </div>
            <button style="--fs: 1rem;" disabled>Sent</button>
        </div>`;
        return component
    },
    personAccept: (color: string, displayname: string, username: string, userid: string) => {
        let component = `
        <div class="person">
            <div class="user-profile" style="--color: ${color};"><i class="fa-solid fa-user"></i></div>
            <div class="userinfo">
                <div class="name">${displayname}</div>
                <div class="username">${username}</div>
            </div>
            <button class="default" style="--fs: 1rem;" onclick="acceptFr(\'${userid}\')">Accept</button>
        </div>`;
        return component
    }
}

const chatComponent = {
    friend: (chatid: string, userid: string, color: string, displayname: string, formattedTime: string, status: string) => {
        let component = `
        <div class="chat" onclick="openChat('${chatid}', '${userid}')">
            <div class="profile" style="--color: ${color};"><i class="fa-solid fa-user"></i></div>
            <div class="chatinfo">
                <div class="name">${displayname}</div>
                <div class="chat-status">
                    <div class="dc"><i class="fa-solid fa-stop"></i> ${status}</div>
                    <i class="bi bi-dot"></i>
                    <div class="time">${formattedTime}</div>
                </div>
            </div>
            <div class="snap" onclick="sendASnap('${chatid}', '${userid}')"><i class="bi bi-camera"></i></div>
        </div>`
        return component
    },
    nofriends: () => {
        let component = `
        <div class="nofrs">
            <h2>No Friends?</h2>
            <span>Explore and meet new friends</span><br>
            <button class="default" id="openFriendRequestsModal">Find Friends</button>
        </div>`
        return component
    }
}

const aUserProfileComponents = {
    bsfTag: `<div class="tag">😊 Best Friend</div>`,
    streakTag: (streak_value: string) => {
        let component = `<div class="tag">🔥 ${streak_value}</div>`
        return component
    },
    snapscoreTag: (score_value: string) => {
        let component = `<div class="tag">👻 ${score_value}</div>`
        return component
    }
}

const miniBioComponent = {
    load: (emoji: string, text: string, id: string) => {
        let component = `<div class="tag minibiotag" id="${id}">${emoji} ${text}</div>`
        return component
    }
}

let messageComponent = {
    message: (usercolor: string, username: string, msg: string, reactions: string[], messageid: string, saved: boolean, continued: boolean) => {
        let reactionsHtml = ""
        if (reactions.length > 0) {
            reactionsHtml = `<div class="reactions">`
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                reactionsHtml += `<div class="reaction">${reaction}</div>`
            }
            reactionsHtml += `</div>`
        } else reactionsHtml = ""

        let component = (continued == false)
        ? `
        <div class="msgspace"></div>
        <div class="user" style="--profcolor: ${usercolor};">${username}</div>
        <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'chat', ${(username == "me") ? true : false})">
            <div class="${(saved) ? 'saved' : ''}" onclick="toggleSaveMsg(this, '${messageid}')">${msg}</div>
            ${reactionsHtml}
        </div>`
        : `
        <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'chat', ${(username == "me") ? true : false})">
            <div class="${(saved) ? 'saved' : ''}" onclick="toggleSaveMsg(this, '${messageid}')">${msg}</div>
            ${reactionsHtml}
        </div>`;
        return component
    },
    replyMessage: (usercolor: string, username: string, msg: string, reactions: string[], messageid: string, saved: boolean, replyusername: string, replyusercolor: string, replymsg: string) => {
        let reactionsHtml = ""
        if (reactions.length > 0) {
            reactionsHtml = `<div class="reactions">`
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                reactionsHtml += `<div class="reaction">${reaction}</div>`
            }
            reactionsHtml += `</div>`
        } else reactionsHtml = ""

        let component = `
        <div class="msgspace"></div>
        <div class="user" style="--profcolor: ${usercolor};">${username}</div>
        <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'chat', ${(username == "me") ? true : false})">
            <div class="${(saved) ? 'saved' : ''}" onclick="toggleSaveMsg(this, '${messageid}')">
                <div class="replied-msg" style="--rcolor: ${replyusercolor};">
                    <div class="user">${replyusername}</div>
                    <div class="msg">${replymsg}</div>
                </div>
                ${msg}
                ${reactionsHtml}
            </div>
        </div>`;
        return component
    },
    deletedMsg: (username: string) => {
        let component = `<div class="deleted-msg">${username} deleted a message!</div>`
        return component
    },
    snap: (newmsg: boolean, username: string, usercolor: string, reactions: string[], messageid: string, opened: boolean, saved: boolean, snappath: string) => {
        let reactionsHtml = ""
        if (reactions.length > 0) {
            reactionsHtml = `<div class="reactions">`
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                reactionsHtml += `<div class="reaction">${reaction}</div>`
            }
            reactionsHtml += `</div>`
        } else reactionsHtml = ""

        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let msg = (opened)
        ? `<i class="fa-regular fa-square"></i> Opened`
        : `<i class="fa-solid fa-square"></i> Tap to View`

        let component = (!saved)
        ? `
            <div class="msgspace"></div>
            ${user_c}
            <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'snap', ${(username == "me") ? true : false})" spp="${snappath}">
                <div class="snap" ${(!opened) ? `onclick="openSnap(this, '${messageid}')"` : ''}>${msg}</div>
                ${reactionsHtml}
            </div>
        `
        : `
            <div class="msgspace"></div>
            ${user_c}
            <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'snap', ${(username == "me") ? true : false})">
                <div class="saved" onclick="toggleSaveMsg(this, '${messageid}')"><img src="${snappath}" onclick="openSnapNormal('${snappath}','${username}','${usercolor}')"></div>
                ${reactionsHtml}
            </div>
        `
        return component
    },
    snapMine: (newmsg: boolean, username: string, usercolor: string, reactions: string[], messageid: string, opened: boolean, saved: boolean, snappath: string) => {
        let reactionsHtml = ""
        if (reactions.length > 0) {
            reactionsHtml = `<div class="reactions">`
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                reactionsHtml += `<div class="reaction">${reaction}</div>`
            }
            reactionsHtml += `</div>`
        } else reactionsHtml = ""

        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let msg = (opened)
        ? `<i class="fa-regular fa-paper-plane"></i> Opened`
        : `<i class="fa-solid fa-paper-plane"></i> Delivered`

        let component = (!saved)
        ? `
            <div class="msgspace"></div>
            ${user_c}
            <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'snap', ${(username == "me") ? true : false})" spp="${snappath}">
                <div class="snap" ${(!opened) ? `onclick="openSnap(this, '${messageid}')"` : ''}>${msg}</div>
                ${reactionsHtml}
            </div>
        `
        : `
            <div class="msgspace"></div>
            ${user_c}
            <div class="chats" style="--profcolor: ${usercolor};" oncontextmenu="chatContextMenu(this, event, '${messageid}', 'snap', ${(username == "me") ? true : false})">
                <div class="saved" onclick="toggleSaveMsg(this, '${messageid}')"><img src="${snappath}" onclick="openSnapNormal('${snappath}','${username}','${usercolor}')"></div>
                ${reactionsHtml}
            </div>
        `
        return component
    }
}

const storyComponent = {
    feed_story: (userid: string, username: string, usercolor: string, laststoryimage: string) => {
        let component = `
        <div class="story" style="--storyringcolor: ${usercolor};" onclick="viewStory('${userid}')">
            <img src="${laststoryimage}" alt="">
            <div class="span">${username}</div>
        </div>`
        return component
    },
    my_story: (timef: string, storyimg: string, storyid: string) => {
        let component = `
        <div class="story">
            <div class="img"><img src="${storyimg}" alt=""></div>
            <div class="name-date" onclick="openManageStory('${storyid}', '${storyimg}')">
                <div class="name">My Story</div>
                <div class="date">${timef}</div>
            </div>
            <div class="delete" onclick="deleteAStory('${storyid}')"><i class="fa-regular fa-trash-can"></i></div>
        </div>`
        return component
    },
    story_viewer: (usercolor: string, username: string) => {
        let component = `
        <div class="user">
            <div class="usericon" style="--color: ${usercolor};"><i class="fa-solid fa-user"></i></div>
            <div class="name">${username}</div>
        </div>`
        return component
    }
}

const storyViewerComponent = {
    init: (username: string, usercolor: string, images: string[], times: string[], storyids: string[], switchFunction: Function, startIndex?: number) => {
        const viewSnap = document.querySelector<HTMLDivElement>("#view-story")
        const viewSnapTabsContainer = document.querySelector<HTMLDivElement>("#view-story-tabs")
        const viewSnapNavLeft = document.querySelector<HTMLDivElement>("#view-story-navl")
        const viewSnapNavRight = document.querySelector<HTMLDivElement>("#view-story-navr")
        const viewSnapCurrentImage = document.querySelector<HTMLImageElement>("#view-story-current-image")
        const viewSnapUserIcon = document.querySelector<HTMLDivElement>("#view-story-usericon")
        const viewSnapUser = document.querySelector<HTMLDivElement>("#view-story-user")
        const viewSnapTime = document.querySelector<HTMLDivElement>("#view-story-time")

        if (viewSnap == null || viewSnapTabsContainer == null) return
        if (viewSnapNavLeft == null || viewSnapNavRight == null) return
        if (viewSnapUserIcon == null || viewSnapCurrentImage == null) return
        if (viewSnapUser == null || viewSnapTime == null) return
        if (images.length == 0) return

        let currentImageIndex = (startIndex && images[startIndex] !== undefined && images[startIndex] !== null) ? startIndex : 0

        viewSnapTabsContainer.innerHTML = ""
        viewSnapUser.innerHTML = ""
        viewSnapTime.innerHTML = ""
        viewSnapCurrentImage.setAttribute("src", "")
        viewSnapUserIcon.setAttribute("style", `--color: transparent;`)
        viewSnap.classList.add("show")

        viewSnapCurrentImage.setAttribute("src", `stories/${images[currentImageIndex]}`)
        viewSnapUser.innerHTML = username
        viewSnapTime.innerHTML = times[currentImageIndex]
        viewSnapUserIcon.setAttribute("style", `--color: ${usercolor};`)

        for (let i = 0; i < images.length; i++) {
            viewSnapTabsContainer.innerHTML += `<div class="tab ${(i==0)?'sel':''}"></div>`
        }

        switchFunction(storyids[currentImageIndex])
        viewSnapNavLeft.addEventListener("click", () => {
            if (currentImageIndex > 0) {
                currentImageIndex--
                viewSnapCurrentImage.setAttribute("src", `stories/${images[currentImageIndex]}`)
                viewSnapTime.innerHTML = times[currentImageIndex]
                
                document.querySelector<HTMLDivElement>(".tab.sel")?.classList.remove("sel")
                viewSnapTabsContainer.children[currentImageIndex].classList.add("sel")

                switchFunction(storyids[currentImageIndex])
            } else viewSnap.classList.remove("show")
        })
        viewSnapNavRight.addEventListener("click", () => {
            if (currentImageIndex < images.length-1) {
                currentImageIndex++
                viewSnapCurrentImage.setAttribute("src", `stories/${images[currentImageIndex]}`)
                viewSnapTime.innerHTML = times[currentImageIndex]

                document.querySelector<HTMLDivElement>(".tab.sel")?.classList.remove("sel")
                viewSnapTabsContainer.children[currentImageIndex].classList.add("sel")
                
                switchFunction(storyids[currentImageIndex])
            } else viewSnap.classList.remove("show")
        })
        viewSnapCurrentImage.addEventListener("click", () => viewSnap.classList.remove("show") )
    }
}