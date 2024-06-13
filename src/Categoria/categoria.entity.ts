import { ObjectId } from "mongodb";

export class Categoria {
    constructor(
        public catId: string,
        public name: string,
        public _id?: ObjectId
    ) {}
}