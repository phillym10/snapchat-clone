import { User } from "../types/types"
import { usersDb } from "./dbcnf"

export const token = {
    auth: (request: any) => { return request.cookies["snapchatcloneauth"] as string | null },
    getkey: async (authtoken: string, key: string) => {
        return new Promise((resolve) => {
            usersDb.findOne({ userauthtoken: authtoken }, (data: any, err: any) => {
                if (!err && data && Object.keys(data).includes(key)) resolve(data[key]);
            })
        })
    },
    getuser: async (authtoken: string) => {
        return new Promise((resolve) => {
            usersDb.findOne({ userauthtoken: authtoken }, (data: User, err: any) => {
                if (!err && data) resolve(data);
            })
        })
    }
}