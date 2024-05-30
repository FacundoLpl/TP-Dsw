import { ObjectId } from "mongodb";

//import crypto from 'node:crypto'
export class ShipmentType {
    constructor(
        public typeId: number,
        public estimatedTime: string, // verificar el tipo de dato
        public type: string,
        public _id?: ObjectId
    ) {}
}
