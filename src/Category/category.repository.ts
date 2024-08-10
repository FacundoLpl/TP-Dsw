import { Repository } from "../shared/repository.js"
import { Category } from "./category.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const categories = db.collection<Category>('categories')

export class categoryRepository implements Repository<Category>{
    public async findAll(): Promise< Category[] | undefined> {
        return await categories.find().toArray()
    }
    
    public async findOne(item: {identificador: string }): Promise<Category | undefined> {
        const _id = new ObjectId(item.identificador)
        return (await categories.findOne({_id})) || undefined
    }

    public async add(item: Category): Promise<Category | undefined >{
        item._id = (await categories.insertOne(item)).insertedId
        return item
    }
// no funciona el new objectid
    public async update(item: Category): Promise<Category | undefined> {
        const { catId, ...categoryInput } = item
        const _id = new ObjectId(catId)
        return (
          (await categories.findOneAndUpdate({_id}, { $set: categoryInput},{returnDocument: 'after'}) || undefined)
       )}
// no funciona el delete
    public async delete(item: { identificador: string ; }): Promise< Category | undefined > {
        const _id = new ObjectId(item.identificador)
        return (await categories.findOneAndDelete({_id})) || undefined;
}
}