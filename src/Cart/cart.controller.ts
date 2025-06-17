import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Cart } from "./cart.entity.js"
import { CartFilter } from "./cart.filter.js"
import { validateCart } from "./cart.schema.js"



const em = orm.em // entity manager funciona como un repository de todas las clases


async function findAll(req: Request,res: Response) { 
    try{
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });}
        if (user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });}
        const filter: CartFilter = req.query
        const carts = await em.find(Cart, filter, {populate: [
                'orders','user','orders.product','shipmentType'
            ]})
        res.status(200).json({message: 'Found all carts', data: carts})
    } catch (error: any){
        res.status(500).json({message: error.message})
}}

async function findOne(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });}
    if (!req.params.id) {
      return res.status(400).json({ message: 'Cart ID is required' });}
    const _id = new ObjectId(req.params.id);
    const cart = await em.findOneOrFail(Cart, { _id }, { populate: ['orders'] });
    if (cart.user.id !== user.id && user.userType !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });}

    return res.status(200).json({ message: 'Found cart', data: cart });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


async function add(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const validationResult = validateCart(req.body);
    if (!validationResult.success) 
      {return res.status(400).json({message: "Invalid cart data",
                  errors: validationResult.error.errors, });}
    if (typeof req.body.total !== 'number' || req.body.total !== 0) {
      return res.status(400).json({ message: 'Total must be 0 if there is no orders' });
    }
    let cart = await em.findOne(Cart, {
                user: req.user.id,
                state: "Pending",});
    if (cart) {
      return res.status(409).json({ message: "Ya tienes un carrito pendiente" });}
    cart = em.create(Cart, {
                    user: user.id,
                    state: "Pending",
                    total: 0,
                  });
                  
    await em.flush();
        return res.status(201).json({ message: 'Cart created', data: cart });}   
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
    }
    


async function update(req: Request,res: Response){
        try {
            const cart: Cart = req.body;
            const user = req.user;
              if (!user) {
                 return res.status(401).json({ message: 'Unauthorized' });
            }
              if (!req.params.id) {
                 return res.status(400).json({ message: 'Cart ID is required' });
            }
            const id = req.params.id;
            const cartToUpdate = await em.findOneOrFail(Cart, { id }, { populate: ['user'] });
              if (!cartToUpdate) {
                return res.status(404).json({ message: "Cart not found" });}
              if (cartToUpdate.total !== cart.total) {
                return res.status(400).json({ message: "Cannot change total" });}
              if (cartToUpdate.user.id !== req.user.id && req.user.userType !== "admin") {
                return res.status(403).json({ message: "Forbidden" });}
              if (cartToUpdate.state !== "Pending") {
                return res.status(400).json({ message: "Cannot update cart" });}
              em.assign(cartToUpdate, req.body);
              await em.flush();
              res.status(200).json({ message: "Cart updated", data: cartToUpdate });
            } catch (error: any) {
                res.status(500).json({ message: error.message });
}}
     
async function remove(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });}
      if (!req.params.id) {
        return res.status(400).json({ message: 'Cart ID is required' });}
      if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid cart ID format' });}
      const _id = new ObjectId(req.params.id);
      const cart = await em.findOneOrFail(Cart, { _id }, { populate: ['orders'] });
      if (cart.user.id !== user.id && user.userType !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });}
      if (!cart.user || !cart.user.id) {
          return res.status(400).json({ message: 'Cart user data missing' });}        
      if (cart.state !== 'Pending') { 
        return res.status(400).json({ message: 'Cannot remove cart' });}
      await em.removeAndFlush(cart);
      return res.status(200).json({ message: 'Cart removed', data: cart });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
    

export { findAll, findOne, add, update, remove}