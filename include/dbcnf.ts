import { JsonDb } from "../jsondb/db";

export const usersDb = new JsonDb("db", "users")
export const chatsDb = new JsonDb("db", "chats")
export const messages = new JsonDb("db", "messages")