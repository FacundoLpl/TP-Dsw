import { Request, Response} from "express"
import { Order } from "./order.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"

const em = orm.em

async function findAll(req: Request,res: Response) { 
    try{
        const orders = await em.find('Order', {})
        res.status(200).json({message: 'finded all orders', data: orders})
    } catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const order = await em.findOneOrFail(Order, { _id }) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found order', data: order})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add (req: Request,res: Response) {
    try{
        const order = em.create(Order, req.body)
        await em.flush()
        res
            .status(201)
            .json({message: 'order created', data: order})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}

    async function update(req: Request,res: Response){
        try {
            const _id = new ObjectId(req.params.id)
            const orderToUpdate = em.getReference(Order,  _id )
            em.assign(orderToUpdate, req.body);
            await em.flush();
            res.status(200).json({ message: "Order updated", data: orderToUpdate })
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
        }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const order = em.getReference(Order, _id )
        await em.removeAndFlush(order)
        res.status(200).json({ message: "Order removed", data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}



export {findAll, findOne, add,update,remove}