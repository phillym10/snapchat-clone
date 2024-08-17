export const token = {
    auth: (response: any) => { return response.cookies["snapchatcloneuath"] as string | null }
}