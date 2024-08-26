const number$ = {
    format: (number: number): string => {
        if (number < 1000) return `${number}`

        let num_str = `${number}`
        let final_digit = ""

        for (let i = num_str.length, counter = 1; i > 0; i--) {
            const digit = num_str[i]
            final_digit = (counter % 3 && i > 0) ? `,${digit}${final_digit}` : `${digit}${final_digit}`
            counter++
        }

        return final_digit
    }
}