import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Cart } from "./cart.entity.js"
import { CartFilter } from "./cart.filter.js"
import { validateOrder } from "../Order/order.schema.js"
import { Order } from "../Order/order.entity.js"
import { Product } from "../Product/product.entity.js"

const em = orm.em // entity manager funciona como un repository de todas las clases


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
        const cart = await em.findOneOrFail(Cart, { _id },
            {populate: ['orders']} 
            ) // primer parametro la clase, 2do el filtro
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
        const cart: Cart = req.body;
        const ordersArray = Array.from(cart.orders);

        const updatePromises = await Promise.all(
          ordersArray.map(async (order: Order) => {
            const validationResult = validateOrder(order);

            if (!validationResult.success) {
              throw new Error(validationResult.error.message);
            }
        
            const orderToUpdate = await em.findOneOrFail(Order, { id: order.id });
            em.assign(orderToUpdate, order);
            await em.flush();
            const id: string = validationResult.data.product;

            let productToUpdate = await em.findOneOrFail(Product, {
              id,
              state: "Active",
            });
            
            if (productToUpdate.stock < order.quantity) {
              throw new Error("Product not available");
            }
            productToUpdate.stock -= order.quantity;
            await em.persistAndFlush(productToUpdate);
          })
        );
        const id = req.params.id;
        const cartToUpdate = await em.findOneOrFail(Cart, { id });
        em.assign(cartToUpdate, req.body);
        await em.flush();
    
        res.status(200).json({ message: "Order updated", data: cartToUpdate });
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