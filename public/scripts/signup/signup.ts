const signupButton = document.querySelector<HTMLButtonElement>("#signupbtn")
signupButton?.addEventListener("click", () => {
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")
    const password2 = document.querySelector<HTMLInputElement>("#password2")
    if (username == null || password == null || password2 == null) return
    if (username.value == "" || password.value == "" || password2.value == "") return
    if (password.value !== password2.value) return

    fetch("/signuprequest", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    }).then((response) => { console.log(response.json()) })
})