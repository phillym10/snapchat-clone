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
    friend: (chatid: string, color: string, displayname: string, formattedTime: string, status: string) => {
        let component = `
        <div class="chat" onclick="openChat('${chatid}')">
            <div class="profile" style="--color: ${color};"><i class="fa-solid fa-user"></i></div>
            <div class="chatinfo">
                <div class="name">${displayname}</div>
                <div class="chat-status">
                    <div class="dc"><i class="fa-solid fa-stop"></i> ${status}</div>
                    <i class="bi bi-dot"></i>
                    <div class="time">${formattedTime}</div>
                </div>
            </div>
            <div class="snap"><i class="bi bi-camera"></i></div>
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