import { Repository } from "../shared/repository.js"
import { User } from "./user.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const users = db.collection<User>('users')

export class UserRepository implements Repository<User>{
    public async findAll(): Promise< User[] | undefined> {
        return await users.find().toArray()
    }
    
    public async findOne(item: {identificador: string; }): Promise<User | undefined> {
        const _id = new ObjectId(item.identificador)
        return (await users.findOne({_id})) || undefined
    }

    public async add(item: User): Promise<User | undefined >{
        item._id = (await users.insertOne(item)).insertedId
        return item
    }

    public async update(item: User): Promise<User | undefined> {
        const { dni, ...userInput } = item
        const _id = new ObjectId(dni)
        return (
            (await users.findOneAndUpdate({_id}, { $set: userInput},{returnDocument: 'after'}) || undefined)
        )}

    public async delete(item: { identificador: string; }): Promise<User | undefined> {
            const _id = new ObjectId(item.identificador);
            const result = await users.findOneAndDelete({ _id });
            return result || undefined;  // Devolver los datos del usuario eliminado
        }
}