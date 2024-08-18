const fr = {
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