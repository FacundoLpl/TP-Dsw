import { Repository } from "../shared/repository.js"
import { Schedule } from "./schedule.entity.js"
import { db } from "../shared/db/conn.js"
import { ObjectId } from "mongodb"

const schedules = db.collection<Schedule>('schedules')

export class scheduleRepository implements Repository<Schedule| undefined> {
    public async findAll(): Promise< Schedule[] | undefined> {
        return await schedules.find().toArray()
    }
    
    public async findOne(item: {identificador: string }): Promise<Schedule | undefined> {
        const _id = new ObjectId(item.identificador)
        return (await schedules.findOne({_id})) || undefined
    }

    public async add(item: Schedule): Promise<Schedule | undefined >{
        item._id = (await schedules.insertOne(item)).insertedId
        return item
    }
// no funciona el new objectid
    public async update(item: Schedule): Promise<Schedule | undefined> {
        const { idSchedule, ...scheduleInput } = item
        const _id = new ObjectId(idSchedule)
        return (
            (await schedules.findOneAndUpdate({_id}, { $set: scheduleInput},{returnDocument: 'after'}) || undefined)
        )}
// no funciona el delete
    public async delete(item: { identificador: string ; }): Promise< Schedule | undefined > {
        const _id = new ObjectId(item.identificador)
        return (await schedules.findOneAndDelete({_id})) || undefined;
}
}