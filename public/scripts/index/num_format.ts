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

const web_wtime = {
    format: (milliseconds: number) => {
        if (milliseconds < 1000) return "few moments ago"
    
        const seconds = Math.floor(milliseconds/1000)
        if (seconds < 60) return `${seconds}s ago`
    
        const minutes = Math.floor(seconds/60)
        if (minutes < 60) return `${minutes}m ago`
    
        const hours = Math.floor(minutes/60)
        if (hours < 24) return `${hours}h ago`
    
        const days = Math.floor(hours/24)
        if (days < 7) return `${days}d ago`
        
        const weeks = Math.floor(days/7)
        if (weeks < 4) return `${weeks}w ago`
        
        const months = Math.floor(weeks/4)
        if (months < 12) return `${months} ${(months>1)?'months':'month'} ago`
        
        const years = Math.floor(months/12)
        return `${years} ${(years>1)?'years':'year'} ago`
    },
    current: () => {
        const date = new Date();
        let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()
        let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()
        return `${hours}:${minutes} ${date.toLocaleTimeString().includes("AM") ? "am" : "pm"}`;
    }
}

const web_wdate = {
    current: () => {
        const date = new Date();
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const month = months[date.getMonth()];
        return `${date.getDate()} ${month} ${date.getFullYear()}`;
    }
}