import { Request, Response, NextFunction } from "express"
import { shipmentTypeRepository } from "./shipmentType.repository.js"
import { ShipmentType } from "./shipmentType.entity.js"
const repository = new shipmentTypeRepository()
//TODO Cambiar esto por la libreria zod


function sanitizeshipmentTypeInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        typeId: req.body.typeId,
        estimatedTime: req.body.estimatedTime,
        type: req.body.type,
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
    const shipmentType = await repository.findOne({identificador:req.params.typeId})
    if (!shipmentType){
        return res.status(404).send({message: ' not found'})
    }
    res.json(shipmentType)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const shipmentTypeInput = new ShipmentType ( 
            input.typeId, 
            input.estimatedTime, 
            input.type, )
    
    const shipmentType = await repository.add(shipmentTypeInput)
    return res.status(201).send({message: 'shipmentType created', data: shipmentType})
    }

async function update(req: Request,res: Response){
        req.body.sanitizedInput.typeId = req.params.typeId
        const shipmentType= await repository.update(req.body.sanitizedInput)
        if(!shipmentType){
            return res.status(404).send({message: ' not found'})
        } 
        return res.status(200).send({message: 'shipmentType updated successfully.', data: shipmentType})
    } 
    
async function remove(req: Request,res: Response){
        const identificador = req.params.typeId
        const shipmentType = await repository.delete({identificador})       
        if(!shipmentType){
            res.status(404).send({message: 'shipmentType not found.'})
        } else {
        res.status(200).send({message: 'shipmentType deleted succesfully'})}
    }


export {sanitizeshipmentTypeInput, findAll, findOne, add, update, remove}