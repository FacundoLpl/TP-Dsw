import { Request, Response} from "express"
import { Order } from "./order.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { validateOrder } from "./order.schema.js"
import { Product } from "../Product/product.entity.js"
import { Cart } from "../Cart/cart.entity.js"

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


    async function add (req: Request, res: Response) {
      try {
        const validationResult = validateOrder(req.body); // uso order schema para sanitizar
        if (!validationResult.success) { // datos incorrectos, error
          return res.status(400).json({ message: validationResult.error.message });
        }

        const product = await em.findOne(Product, validationResult.data.product);
        if ( // si no existe el producto, esta archivado o no hay stock
          !product ||
          product.state === "Archived" ||
          product.stock < validationResult.data.quantity
        ) {
          return res.status(400).json({ message: "Product not available" }); //devuelvo error
        }
    
        let cart = await em.findOne( // encuentro carrito
          Cart,
          { user: req.body.user,
            state: "Pending"},
        );
    
        if (!cart) { // si no tiene cart pendiente, creo uno
          cart = em.create(Cart, {
            user: req.body.user,
            state: "Pending",
            total: req.body.subtotal,
          });
        } else { // ya tiene cart pendiente
          cart.total += validationResult.data.subtotal;
        }
    
        validationResult.data.cart = cart.id; // agrego el cart al order (o el nuevo o el encontrado)
    
        // Asegurarse de que la colección 'orders' esté completamente cargada
        await cart.orders.init();
    
        // Verificar si ya existe una orden con el mismo producto en el carrito
        const existingOrder = cart.orders.getItems().find(order => order.product === product);
    
        if (existingOrder) { // si ya existe el producto en el carrito, actualizo la cantidad
          existingOrder.quantity += validationResult.data.quantity;
          existingOrder.subtotal += validationResult.data.subtotal;
          em.persist(existingOrder);          // Persistir la orden modificada
        } else { // si no existe, creo un nuevo order
          const order = em.create(Order, { // creo el order
            quantity: validationResult.data.quantity,
            product: product,
            cart: cart,
            subtotal: validationResult.data.subtotal,
          });
    
          em.persist(order); // Persistir la nueva orden
        }
        em.persist(cart); // Persistir el carrito si es necesario (en caso de que se haya modificado el total)
    
        await em.flush(); // Guardar todos los cambios
    
        res.status(201).json({ message: "Order created", data: cart });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
    

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