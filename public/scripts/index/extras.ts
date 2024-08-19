async function searchusers(query: string) {
    return new Promise((resolve) => {
        fetch(`/fr/searchusers/${query}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => { return response.json() })
        .then((data) => resolve(data.message))
    })
}

async function getUserFriendRequests() {
    return new Promise((resolve) => {
        fetch(`/fr/requests`, {
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