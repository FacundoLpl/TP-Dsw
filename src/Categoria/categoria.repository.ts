import { Repository } from "../shared/repository.js"
import { Categoria } from "./categoria.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const categorias = db.collection<Categoria>('categorias')

export class categoriaRepository implements Repository<Categoria>{
    public async findAll(): Promise< Categoria[] | undefined> {
        return await categorias.find().toArray()
    }
    
    public async findOne(item: {identificador: string }): Promise<Categoria | undefined> {
        const _id = new ObjectId(item.identificador)
        return (await categorias.findOne({_id})) || undefined
    }

    public async add(item: Categoria): Promise<Categoria | undefined >{
        item._id = (await categorias.insertOne(item)).insertedId
        return item
    }
// no funciona el new objectid
    public async update(item: Categoria): Promise<Categoria | undefined> {
        const { catId, ...categoriaInput } = item
        const _id = new ObjectId(catId)
        return (
          (await categorias.findOneAndUpdate({_id}, { $set: categoriaInput},{returnDocument: 'after'}) || undefined)
       )}
// no funciona el delete
    public async delete(item: { identificador: string ; }): Promise< Categoria | undefined > {
        const _id = new ObjectId(item.identificador)
        return (await categorias.findOneAndDelete({_id})) || undefined;
}
}