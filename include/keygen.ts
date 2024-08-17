export const keygen = {
    uauthtoken: () => {
        const chars = 29
        const letters = "cdghabefijkuvpqlstzxomwynr"
        const nums = "4501967238"
        let final = "UAT"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    },
    uid: () => {
        const chars = 15
        const letters = "abcdefghijklmnopqrstuvwxyz"
        const nums = "0123456789"
        let final = "U"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    },
    msgid: () => {
        const chars = 15
        const letters = "pqkbcwxjdmoyzalefghirstnuv"
        const nums = "5612084379"
        let final = "M"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    },
    chatid: () => {
        const chars = 14
        const letters = "dmnwxjghilopqvayzkbctuefrs"
        const nums = "3750612849"
        let final = "C_"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    },
    gchatid: () => {
        const chars = 14
        const letters = "ohirspqbxjlcdmnfgyzektuvaw"
        const nums = "3756084129"
        let final = "GC_"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    },
    storyid: () => {
        const chars = 14
        const letters = "pqyzefwxjlirbcstkdmnoghuva"
        const nums = "8436120579"
        let final = "stry"

        for (let i = 0; i < chars; i++) {
            const r = (((i+3)%4) == 0) ? true : false
            if (r) {
                final += nums[Math.floor(Math.random() * nums.length)]
            } else {
                const s = (((i-1)%5) == 0) ? true : false
                const index = Math.floor(Math.random() * letters.length)
                final += (s === true) ? letters[index].toUpperCase() : letters[index]
            }
        }

        return final
    }
}