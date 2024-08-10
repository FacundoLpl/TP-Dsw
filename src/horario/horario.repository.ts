import { Repository } from "../shared/repository.js"
import { Horario } from "./horario.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const horarios = db.collection<Horario>('horarios')

export class horarioRepository implements Repository<Horario>{
    public async findAll(): Promise< Horario[] | undefined> {
        return await horarios.find().toArray()
    }
    
    public async findOne(item: {identificador: string }): Promise<Horario | undefined> {
        const _id = new ObjectId(item.identificador)
        return (await horarios.findOne({_id})) || undefined
    }

    public async add(item: Horario): Promise<Horario | undefined >{
        item._id = (await horarios.insertOne(item)).insertedId
        return item
    }
// no funciona el new objectid
    public async update(item: Horario): Promise<Horario | undefined> {
        const { idHorario, ...horarioInput } = item
        const _id = new ObjectId(idHorario)
        return (
            (await horarios.findOneAndUpdate({_id}, { $set: horarioInput},{returnDocument: 'after'}) || undefined)
        )}
// no funciona el delete
    public async delete(item: { identificador: string ; }): Promise< Horario | undefined > {
        const _id = new ObjectId(item.identificador)
        return (await horarios.findOneAndDelete({_id})) || undefined;
}
}