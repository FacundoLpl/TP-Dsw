import { Repository } from "../shared/repository.js"
import { ShipmentType } from "./shipmentType.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const shipmentTypes = db.collection<ShipmentType>('shipmentTypes')

export class shipmentTypeRepository implements Repository<ShipmentType>{
    public async findAll(): Promise< ShipmentType[] | undefined> {
        return await shipmentTypes.find().toArray()
    }
    
    public async findOne(item: {dni: string; }): Promise<ShipmentType | undefined> {
        const _id = new ObjectId(item.dni)
        return (await shipmentTypes.findOne({_id})) || undefined
    }

    public async add(item: ShipmentType): Promise<ShipmentType | undefined >{
        item._id = (await shipmentTypes.insertOne(item)).insertedId
        return item
    }
// no funciona el new objectid
    public async update(item: ShipmentType): Promise<ShipmentType | undefined> {
        const { typeId, ...shipmentTypeInput } = item
        const _id = new ObjectId(typeId)
        return (
            (await shipmentTypes.findOneAndUpdate({_id}, { $set: shipmentTypeInput},{returnDocument: 'after'}) || undefined)
        )}
// no funciona el delete
    public async delete(item: { typeId: number; }): Promise< ShipmentType | undefined > {
        const _id = new ObjectId(item.typeId)
        return (await shipmentTypes.findOneAndDelete({_id})) || undefined
}
}