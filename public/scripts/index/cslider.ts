
type ColorKeys = 'red' | 'green' | 'blue'
const CSlider = {
    handle: (id: string) => {
        const cslider = document.querySelector<HTMLDivElement>(`#${id}`)
        if (cslider == null) return
        const csliderBar = cslider.children[0] as HTMLInputElement
        const csliderChosen = cslider.children[1] as HTMLDivElement
        if (csliderBar == null || csliderChosen == null) return

        let moving = false
        const calcRGB = () => {
            let delta = -1
            let color_val = { red: 255, green: 0, blue: 0 }
            let csval = parseInt(csliderBar.value)
            delta = (csval >= 100 && "135".includes(`${csval}`[0])) ? -1 : 1

            let colorChanging: ColorKeys = "green"
            let workingval: number  = (csval >= 300) ? csval-300 : csval
            if (workingval > 100 && workingval < 201) colorChanging = "red"
            if (workingval > 200) colorChanging = "blue"

            let staticColor: ColorKeys = "red"
            if (csval > 100 && csval < 301) staticColor = "green"
            if (csval > 300 && csval < 501) staticColor = "blue"
            
            let ignored: ColorKeys = "red"
            if (staticColor == "red" && colorChanging == "blue") ignored = "green"
            if (staticColor == "red" && colorChanging == "green") ignored = "blue"
            if (staticColor == "blue" && colorChanging == "green") ignored = "red"

            let change = (delta < 0) 
            ? Math.floor(255 - (((csval % 100)/100) * 255))
            : Math.floor(((csval % 100)/100) * 255)

            color_val[staticColor] = 255
            color_val[colorChanging] = change
            color_val[ignored] = 0

            csliderChosen.setAttribute("color", `rgb(${color_val.red},${color_val.green},${color_val.blue})`)
            csliderChosen.setAttribute("style", `--color: rgb(${color_val.red},${color_val.green},${color_val.blue})`)
        }

        csliderBar.addEventListener("mousemove", () => {
            if (!moving) return
            calcRGB()
        })
        csliderBar.addEventListener("change", calcRGB)
        csliderBar.addEventListener("mousedown", () => { moving = true })
        csliderBar.addEventListener("mouseup", () => { moving = false })
    }
}