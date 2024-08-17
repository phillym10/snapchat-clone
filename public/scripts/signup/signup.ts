const signupButton = document.querySelector<HTMLButtonElement>("#signupbtn")
signupButton?.addEventListener("click", () => {
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")
    const password2 = document.querySelector<HTMLInputElement>("#password2")
    const alertBad = document.querySelector<HTMLDivElement>("#alertbad")
    if (alertBad == null) return
    if (username == null || password == null || password2 == null) return
    if (username.value == "" || password.value == "" || password2.value == "") {
        alertBad.innerHTML = "Please fill out all the fields";
        return
    }
    if (password.value !== password2.value) { alertBad.innerHTML = "Passwords don't match"; return }

    fetch("/signuprequest", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    }).then((response) => { return response.json() })
    .then((data) => {
        if (data.message == "success") { window.location.assign("/") } 
        else if (data.message == "userexists") {
            alertBad.innerHTML = "That username is not available"
        } else alertBad.innerHTML = "Please try again"
    })
})