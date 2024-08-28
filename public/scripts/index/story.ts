const addStoryButton = document.querySelector<HTMLButtonElement>("#add-a-story-btn")
const sendStory = document.querySelector<HTMLDivElement>("#send-story")
const sendStoryCloseButton = document.querySelector<HTMLButtonElement>("#send-story-clsbtn")
const sendStoryFileInput = document.querySelector<HTMLInputElement>("#send-storyfile")

const previewStory = document.querySelector<HTMLButtonElement>("#preview-send-story")
const previewStoryCloseButton = document.querySelector<HTMLButtonElement>("#preview-send-story-closebtn")
const previewStorySendButton1 = document.querySelector<HTMLInputElement>("#preview-send-story-send1")
const previewStorySendButton2 = document.querySelector<HTMLInputElement>("#preview-send-story-send2")
const previewStoryImage = document.querySelector<HTMLImageElement>("#preview-send-story-image")

const manageStory = document.querySelector<HTMLDivElement>("#manage-stories")
const manageStoryCloseButton = document.querySelector<HTMLButtonElement>("#manage-stories-clsbtn")
const manageStoryImage = document.querySelector<HTMLDivElement>("#manage-stories-storyimage")
const manageStoryViewersTitle = document.querySelector<HTMLDivElement>("#manage-stories-views")
const manageStoryViewersContainer = document.querySelector<HTMLDivElement>("#manage-stories-viewers")

const storyContainer = document.querySelector<HTMLDivElement>("#stories")

async function loadStories() {
    if (storyContainer == null) return

    const feedStories: any = await loadFeedStories()
    if (!Array.isArray(feedStories)) return

    for (let i = 0; i < feedStories.length; i++) {
        const feedStory = feedStories[i];
        const feedStoryUser: any = await getUser(feedStory.userid)
        const currentUserId: any = await ScCloneUser.getkey("userid")
        console.log([feedStory, feedStoryUser])

        storyContainer.innerHTML += (feedStory.stories.length > 0)
        ? storyComponent.feed_story(feedStoryUser.userid, feedStoryUser.displayname, feedStoryUser.usercolor, `stories/${feedStory.stories[feedStory.stories.length-1].storyimage}`)
        : ""
    }
}

async function openManageStory(storyid: string, imgsrc: string) {
    if (manageStory == null || manageStoryImage == null) return
    if (manageStoryViewersTitle == null || manageStoryViewersContainer == null) return
    manageStory.classList.add("show")

    const currentUser = await getCurrentUser()
    if (currentUser == undefined) return
    if (!isUser(currentUser)) return

    const currentUsersStory: any = await getUserStory(currentUser.userid, storyid)
    if (currentUsersStory == "error") return

    manageStoryImage.setAttribute("src", imgsrc)

    manageStoryViewersTitle.innerHTML = ""
    manageStoryViewersContainer.innerHTML = ""
    if (currentUsersStory.watched.length < 1) {
        manageStoryViewersTitle.innerHTML = "No views"
    } else {
        manageStoryViewersTitle.innerHTML = (currentUsersStory.watched.length < 2) ? "1 view" : `${currentUsersStory.watched.length} views`

        for (let i = 0; i < currentUsersStory.watched.length; i++) {
            const story_watcher_id = currentUsersStory.watched[i];
            const story_watcher: any = await getUser(story_watcher_id)
            manageStoryViewersContainer.innerHTML += storyComponent.story_viewer(story_watcher.usercolor, story_watcher.displayname)
        }
    }
}

async function deleteAStory(storyid: string) {
    await deleteStory(storyid)
    
    const currentUser = await getCurrentUser()
    if (currentUser == undefined || userStories == null) return
    if (!isUser(currentUser)) return
    
    userStories.innerHTML = ""
    const currentUsersStories: any = await getUserStories(currentUser.userid)
    if (currentUsersStories.stories.length < 1) {
        userStories.innerHTML = "No Stories"
    } else {
        for (let i = currentUsersStories.stories.length-1; i >= 0; i--) {
            const currentUserStory = currentUsersStories.stories[i];
            userStories.innerHTML += storyComponent.my_story(web_wtime.format(Date.now()-currentUserStory.timeout), `stories/${currentUserStory.storyimage}`, currentUserStory.storyid)
        }
    }
}

async function viewStory(userid: string) {
    const currentUser = await getCurrentUser()
    const storyOwner = await getUser(userid)
    if (currentUser == undefined) return
    if (!isUser(currentUser) || !isUser(storyOwner)) return
    
    const storyOwnerStories: any = await getUserStories(storyOwner.userid)

    const images: any[] = []
    const storyids: any[] = []
    const times: any[] = []
    for (let i = 0; i < storyOwnerStories.stories.length; i++) {
        const storyOwnerStory = storyOwnerStories.stories[i];
        images.push(storyOwnerStory.storyimage)
        storyids.push(storyOwnerStory.storyid)
        times.push(web_wtime.format(Date.now() - storyOwnerStory.timeout))
    }

    storyViewerComponent.init(
        storyOwner.displayname, storyOwner.usercolor, images, times, storyids,
        async (storyid: any) => { await viewAStory(userid, storyid, currentUser.userid) })
}

async function addAStory() {
    if (sendStory == null) return
    if (previewStory == null || previewStoryImage == null) return
    previewStory.classList.remove("show")
    sendStory.classList.remove("show")
    await addAUserStory(previewStoryImage.src)
}

manageStoryCloseButton?.addEventListener("click", () => {
    if (manageStory == null) return
    manageStory.classList.remove("show")
})

addStoryButton?.addEventListener("click", () => {
    if (sendStory == null || sendStoryCloseButton == null) return
    if (sendStoryFileInput == null) return
    if (previewStory == null || previewStoryImage == null) return

    sendStory.classList.add("show")
    sendStoryFileInput.addEventListener("change", (event: any) => {
        if (event == null || event.target == null) return
        const file = event.target.files[0]

        if (!file) return
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e: any) => {
            previewStoryImage.setAttribute("src", `${e.target.result}`)
            previewStory.classList.add("show")
        }
        reader.readAsDataURL(file)
    })

    previewStorySendButton1?.addEventListener("click", async () => { await addAStory() })
    previewStorySendButton2?.addEventListener("click", async () => { await addAStory() })
    sendStoryCloseButton.addEventListener("click", () => {
        sendStory.classList.remove("show")
    })
})

previewStoryCloseButton?.addEventListener("click", () => {
    if (previewStory == null || previewStoryImage == null) return
    previewStoryImage.setAttribute("src", "")
    previewStory.classList.remove("show")
})