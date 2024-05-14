import { ObjectId } from "mongodb";

//import crypto from 'node:crypto'
export class User {
    constructor(
        public dni: string,
        public firstName: string,
        public lastName: string,
        public userType: string,
        public _id?: ObjectId
    ) {}
}
