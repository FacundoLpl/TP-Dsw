import { Request, Response, NextFunction } from "express"
import { scheduleRepository } from "./schedule.repository.js"
import { Schedule } from "./schedule.entity.js"
const repository = new scheduleRepository()
//TODO Cambiar esto por la libreria zod


function sanitizescheduleInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        idSchedule: req.body.idSchedule,
        timeFrom: req.body.timeFrom,
        estimatedTime: req.body.estimatedTime,
        toleranceTime: req.body.toleranceTime,
    }

    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key] === undefined) 
            delete req.body.sanitizedInput[key]
    })
    next()
}


async function findAll(req: Request,res: Response) { 
    res.json({data: await repository.findAll()})
}

async function findOne (req: Request, res: Response){
    const schedule = await repository.findOne({identificador:req.params.idSchedule})
    if (!schedule){
        return res.status(404).send({message: ' not found'})
    }
    res.json(schedule)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const scheduleInput = new Schedule ( 
            input.idSchedule, 
            input.timeFrom, 
            input.estimatedTime,
            input.toleranceTime)
    
    const schedule = await repository.add(scheduleInput)
    return res.status(201).send({message: 'schedule created', data: schedule})
    }

async function update(req: Request,res: Response){
        req.body.sanitizedInput.idSchedule = req.params.idSchedule
        const schedule= await repository.update(req.body.sanitizedInput)
        if(!schedule){
            return res.status(404).send({message: ' not found'})
        } 
        return res.status(200).send({message: 'schedule updated successfully.', data: schedule})
    } 
    
async function remove(req: Request,res: Response){
        const identificador = req.params.idSchedule
        const schedule = await repository.delete({identificador})       
        if(!schedule){
            res.status(404).send({message: 'schedule not found.'})
        } else {
        res.status(200).send({message: 'schedule deleted succesfully'})}
    }


export {sanitizescheduleInput, findAll, findOne, add, update, remove}