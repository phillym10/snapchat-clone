const loginButton = document.querySelector<HTMLButtonElement>("#loginbtn")
loginButton?.addEventListener("click", () => {
    const username = document.querySelector<HTMLInputElement>("#username")
    const password = document.querySelector<HTMLInputElement>("#password")
    const alertBad = document.querySelector<HTMLDivElement>("#alertbad")
    if (alertBad == null) return
    if (username == null || password == null) return
    if (username?.value == "" || password?.value == "") return

    fetch("/loginrequest", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    }).then((response) => { return response.json() })
    .then((data) => {
        console.log(data.message)
        if (data.message == "success") window.location.assign("/"); else {
            alertBad.innerHTML = "Incorrect Username and Password"
        }
    })
})