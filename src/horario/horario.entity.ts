
import { ObjectId } from "mongodb";
//import crypto from 'node:crypto'


export class Horario {
    constructor(
        public idHorario: string,
        public horaDesde: Date, // verificar el tipo de dato
        public tiempoEstimado: string, 
        public tiempoTolerancia: string,
        public _id?: ObjectId
    ) {}
}
