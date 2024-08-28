const addStoryButton = document.querySelector<HTMLButtonElement>("#add-a-story-btn")
const sendStory = document.querySelector<HTMLDivElement>("#send-story")
const sendStoryCloseButton = document.querySelector<HTMLDivElement>("#send-story-clsbtn")
const sendStoryFileInput = document.querySelector<HTMLInputElement>("#send-storyfile")



async function loadStories() {
    const feedStories = await loadFeedStories()
    console.log(feedStories)
}

addStoryButton?.addEventListener("click", () => {
    console.log([sendStory,sendStoryCloseButton,sendStoryFileInput])
    if (sendStory == null || sendStoryCloseButton == null) return
    if (sendStoryFileInput == null) return

    sendStory.classList.add("show")
})