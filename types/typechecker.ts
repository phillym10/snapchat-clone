import { User } from "./types";

export function isUser(object: any): object is User {
    return typeof object === 'object' &&
           object !== null &&
           typeof object.userid === 'string' &&
           typeof object.userauthtoken === 'string' &&
           typeof object.displayname === 'string' &&
           typeof object.username === 'string' &&
           typeof object.password === 'string' &&
           typeof object.usercolor === 'string' &&
           typeof object.friends === 'object' &&
           typeof object.friendRequests === 'object' &&
           (typeof object.closeFriend === 'string' || typeof object.closeFriend === 'object') &&
           typeof object.verified === 'boolean' &&
           typeof object.mode === 'string'
}