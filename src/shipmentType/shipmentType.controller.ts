import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ShipmentType } from "./shipmentType.entity.js"
import { ObjectId } from "@mikro-orm/mongodb"


const em = orm.em


async function findAll(req: Request,res: Response) { 
    try{
        const shipmentTypes = await em.find('ShipmentType', {})
        res.status(200).json({message: 'finded all shipmentTypes', data: shipmentTypes})
    } catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const shipmentType = await em.findOneOrFail(ShipmentType, { _id }) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found shipmentType', data: shipmentType})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add (req: Request,res: Response) {
    try{
        const shipmentType = em.create(ShipmentType, req.body)
        await em.flush()
        res
            .status(201)
            .json({message: 'shipmentType created', data: shipmentType})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}

async function update(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const shipmentTypeToUpdate = em.getReference(ShipmentType,  _id )
        em.assign(shipmentTypeToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "ShipmentType updated", data: shipmentTypeToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const shipmentType = em.getReference(ShipmentType, _id )
        await em.removeAndFlush(shipmentType)
        res.status(200).json({ message: "ShipmentType removed", data: shipmentType })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}


export {findAll, findOne, add, update, remove}