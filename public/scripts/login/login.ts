const loginButton = document.querySelector<HTMLButtonElement>("#loginbtn")
loginButton?.addEventListener("click", () => {
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")
    if (username == null || password == null) return
    if (username?.value == "" || password?.value == "") return

    fetch("/loginrequest", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    }).then((response) => { console.log(response.json()) })
})