import { JsonDb } from "../jsondb/db";

export const usersDb = new JsonDb("db", "users")
export const chatsDb = new JsonDb("db", "chats")
export const messagesDb = new JsonDb("db", "messages")