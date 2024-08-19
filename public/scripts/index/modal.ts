const modal = document.querySelector<HTMLDivElement>("#modal")
const ModalController = {
    inputmodal: (title: string, placeholder: string, value = "", callback: Function) => {
        if (modal == null) return
        modal.classList.add("show")
        let component = `
        <div class="modalbox inputmodal">
            <div class="title">${title}</div>
            <div class="input">
                <input type="text" name="modalinput" id="modalinput" autocomplete="off" placeholder="${placeholder}" value="${value}">
            </div>
            <div class="buttons">
                <button class="default" id="inputmodalbtn">Yes</button>
                <button class="regular" onclick="closeModal()">No</button>
            </div>
        </div>`;
        modal.innerHTML = component
        const yesButton = document.querySelector<HTMLButtonElement>("#inputmodalbtn")
        yesButton?.addEventListener("click", () => {
            const input = document.querySelector<HTMLInputElement>("#modalinput")
            if (input == null || input?.value == null) return
            closeModal()
            callback(input.value)
        })
    },
    colorSlidermodal: (callback: Function) => {
        if (modal == null) return
        modal.classList.add("show")
        let component = `
        <div class="modalbox colorslider">
            <div class="title">Choose a color</div>
            <div class="cslider" id="modalcslider">
                <input type="range" name="color" id="color-picker" value="0" min="0" max="600">
                <div class="chosen" style="--color: #2869f5;"></div>
            </div>
            <div class="buttons">
                <button class="default" id="colormodalbtn">Yes</button>
                <button class="regular" onclick="closeModal()">No</button>
            </div>
        </div>`;
        modal.innerHTML = component
        CSlider.handle("modalcslider")

        const yesButton = document.querySelector<HTMLButtonElement>("#colormodalbtn")
        yesButton?.addEventListener("click", () => {
            const cslider = document.querySelector<HTMLDivElement>(`#modalcslider`)
            if (cslider == null) return
            const csliderChosen = cslider.children[1] as HTMLDivElement
            if (csliderChosen == null) return
            
            closeModal()
            callback(csliderChosen.dataset.color)
        })
    }
}

function closeModal() {
    if (modal == null) return
    modal.classList.remove("show")
}