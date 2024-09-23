import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { Schedule } from "./schedule.entity.js"
import { ObjectId } from "@mikro-orm/mongodb"


const em = orm.em


async function findAll(req: Request,res: Response) { 
    try{
        const schedules = await em.find('Schedule', {})
        res.status(200).json({message: 'found all schedules', data: schedules})
    } catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const schedule = await em.findOneOrFail(Schedule, { _id }) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found schedule', data: schedule})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add (req: Request,res: Response) {
    try{
        const schedule = em.create(Schedule, req.body)
        await em.flush()
        res
            .status(201)
            .json({message: 'schedule created', data: schedule})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}

async function update(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const scheduleToUpdate = em.getReference(Schedule,  _id )
        em.assign(scheduleToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "Schedule updated", data: scheduleToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const schedule = em.getReference(Schedule, _id )
        await em.removeAndFlush(schedule)
        res.status(200).json({ message: "Schedule removed", data: schedule })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}

    export {findAll, findOne, add, update, remove}