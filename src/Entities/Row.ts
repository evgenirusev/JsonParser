import { Friend } from "./Friend";

export class Row {
    avatar: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    IPAddress: string;
    friends: Array<Friend>;
}