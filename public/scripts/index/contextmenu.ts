const contextmenu = document.querySelector<HTMLDivElement>("#context-menu")
const bodycontainer = document.querySelector<HTMLDivElement>("#context-menu")
// document.addEventListener("contextmenu", (e) => {
//     e.preventDefault()
//     if (contextmenu == null || bodycontainer == null)   return
//     const bodyContainerCoords = bodycontainer.getBoundingClientRect()
//     console.log([bodyContainerCoords.left, bodyContainerCoords.top])
//     console.log([e.offsetX, e.offsetY])

//     contextmenu.classList.remove("show")
//     contextmenu.setAttribute("style", `--mousex: ${e.offsetX}px; --mousey: ${e.offsetY}px;`)
//     contextmenu.classList.add("show")
// })