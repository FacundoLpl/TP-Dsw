import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Cart } from "./cart.entity.js"
import { CartFilter } from "./cart.filter.js"
import { validateCart } from "./cart.schema.js"



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
            const validationResult = validateCart(req.body);
            if (!validationResult.success) 
                { return res.status(400).json({ message: validationResult.error.message });}
            let cart = await em.findOne(Cart, {
                user: req.user.id,
                state: "Pending",
              });
              
              if (cart) { 
                res.status(400).json({ message: "User already has a cart pending" });}
                cart = em.create(Cart, {
                    user: req.user.id,
                    state: "Pending",
                    total: req.body.total,
                  });
                  
            await em.flush();
            res.status(201).json({ message: 'cart created', data: cart });}
         catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    


    async function update(req: Request,res: Response){
        try {
            const cart: Cart = req.body;
              const id = req.params.id
              const cartToUpdate = await em.findOneOrFail(Cart, { id, user: req.user.id });
              em.assign(cartToUpdate, req.body);
              await em.flush();
              res.status(200).json({ message: "Cart updated", data: cartToUpdate });
            } catch (error: any) {
                res.status(500).json({ message: error.message });
  }}
     
  async function remove(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const _id = new ObjectId(req.params.id);
  
      const cart = await em.findOneOrFail(Cart, { _id, user: userId }, { populate: ['orders'] });
  
      await em.removeAndFlush(cart);
  
      return res.status(200).json({ message: 'Cart removed', data: cart });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
    

export { findAll, findOne, add, update, remove}