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
            <div class="snap" onclick="sendASnap('${userid}')"><i class="bi bi-camera"></i></div>
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

const messageComponent = {
    message: (usercolor: string, username: string, msg: string) => {
        let component = `
        <div class="msgspace"></div>
        <div class="user" style="--profcolor: ${usercolor};">${username}</div>
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="">${msg}</div>
        </div>`;
        return component
    },
    continueMsg: (usercolor: string, username: string, msg: string) => {
        // let reactionsHtml = ""
        // if (reactions.length > 0) {
        //     reactionsHtml = `<div class="reactions">`
        //     for (let i = 0; i < reactions.length; i++) {
        //         const reaction = reactions[i];
        //         reactionsHtml += `<div class="reaction">${reaction}</div>`
        //     }
        //     reactionsHtml += `</div>`
        // } else reactionsHtml = ""
        let component = `
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="">${msg}</div>
        </div>`;
        return component
    },
    unopenedSnap: (newmsg: boolean, username: string, usercolor: string) => {
        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let component = `
        ${user_c}
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="snap" onclick="openSnap()"><i class="fa-solid fa-square"></i> Tap to View</div>
        </div>`;
        return component
    },
    unopenedSnapMine: (newmsg: boolean, username: string, usercolor: string) => {
        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let component = `
        ${user_c}
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="snap" onclick="openSnap()"><i class="fa-solid fa-paper-plane"></i> Delivered</div>
        </div>`;
        return component
    },
    openedSnap: (newmsg: boolean, username: string, usercolor: string) => {
        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let component = `
        ${user_c}
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="snap" onclick="openSnap()"><i class="fa-regular fa-square"></i> Opened</div>
        </div>`;
        return component
    },
    openedSnapMine: (newmsg: boolean, username: string, usercolor: string) => {
        let user_c = (newmsg == true) ? `<div class="user" style="--profcolor: ${usercolor};">${username}</div>`: ""
        let component = `
        ${user_c}
        <div class="chats" style="--profcolor: ${usercolor};">
            <div class="snap" onclick="openSnap()"><i class="fa-regular fa-paper-plane"></i> Opened</div>
        </div>`;
        return component
    }
}