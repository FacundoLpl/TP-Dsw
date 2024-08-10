
import { ObjectId } from "mongodb";
//import crypto from 'node:crypto'


export class Schedule {
    constructor(
        public idSchedule: string,
        public timeFrom: Date, // verificar el tipo de dato
        public estimatedTime: string, 
        public toleranceTime: string,
        public _id?: ObjectId
    ) {}
}
