async function searchusers(query: string) {
    return new Promise((resolve) => {
        fetch(`/fr/searchusers/${query}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getAllUserFriendRequests() {
    return new Promise((resolve) => {
        fetch(`/fr/allfr`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function sendFriendRequest(touserid: string) {
    return new Promise((resolve) => {
        fetch(`/fr/sendfr`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ touserid: touserid })
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function acceptFriendRequest(touserid: string) {
    return new Promise((resolve) => {
        fetch(`/fr/acceptfr`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ touserid: touserid })
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function loadUserFriends() {
    return new Promise((resolve) => {
        fetch(`/friends/allfriends`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getCurrentUser() {
    return new Promise((resolve) => {
        fetch("/user").then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getUser(userid: string | any) {
    return new Promise((resolve) => {
        fetch(`/chats/chatinfo/${userid}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function updateUser(key: string, value: string) {
    return new Promise((resolve) => {
        fetch(`/user/update/${key}/${value}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getChatInfo(chatid: string) {
    return new Promise((resolve) => {
        fetch(`/chats/${chatid}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getLastMessage(chatid: string) {
    return new Promise((resolve) => {
        fetch(`/msgs/getlastmsg`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatid: chatid })
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function sendMessage(chatid: string, message: string, type: string, replyto: string) {
    return new Promise((resolve) => {
        fetch("/msgs/sendmsg", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatid: chatid, message: message, msgtype: type, replytomsgid: replyto })
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getChatMessages(chatid: string) {
    return new Promise((resolve) => {
        fetch("/chats/getmsgs", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatid: chatid })
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}