import { ObjectId } from "mongodb";

export class Category {
    constructor(
        public catId: string,
        public name: string,
        public _id?: ObjectId
    ) {}
}