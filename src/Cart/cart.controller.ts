import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Cart } from "./cart.entity.js"
import { CartFilter } from "./cart.filter.js"

const em = orm.em // entity manager funciona como un repository de todas las clases

// el 3er parametro indicamos que relaciones queremos que cargue
async function findAll(req: Request,res: Response) { 
    try{
        const filter: CartFilter = req.query
        const carts = await em.find(Cart, filter, {
            populate: [
                'orders',
                'user',
                'orders.product',
                'shipmentType'
            ]})
        res.status(200).json({message: 'Found all carts', data: carts})
    } catch (error: any){
        res.status(500).json({message: error.message})
}}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const cart = await em.findOneOrFail(Cart, { _id },{populate: ['orders']} ) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found cart', data: cart})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add(req: Request, res: Response) {
        try {
            const cart = em.create(Cart, req.body); 
    
            await em.flush();
    
            res.status(201).json({ message: 'cart created', data: cart });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    

async function update(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const cartToUpdate = em.getReference(Cart,  _id )
        em.assign(cartToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "Cart updated", data: cartToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const cart = em.getReference(Cart, _id )
        await em.removeAndFlush(cart)
        res.status(200).json({ message: "Cart removed", data: cart })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}


export { findAll, findOne, add, update, remove}