const ScCloneUser = {
    getkey: async (key: string) => {
        return new Promise((resolve) => {
            fetch(`/user/${key}`).then((response) => { return response.json() })
            .then((data) => resolve(data.message))
        })
    }
}