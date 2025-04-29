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
        res.status(200).json({message: 'found all orders', data: orders})
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


async function add(req: Request, res: Response) {
      try {
        const validationResult = validateOrder(req.body);
        if (!validationResult.success) {
          return res.status(400).json({ message: validationResult.error.message });
        }
    
        const product = await em.findOne(Product, validationResult.data.product);
    
        // Validación fuerte: si no existe, archivado o stock inválido

if (
  !product ||
  product.state === "Archived" ||
  product.stock == null || // null o undefined
  typeof product.stock !== "number" || 
  isNaN(product.stock) || // <<<<<< ESTA es la que faltaba
  product.stock < validationResult.data.quantity
)
 {
          return res.status(400).json({ message: "Product not available" });
        }

        let cart = await em.findOne(Cart, {
          user: req.user.id,
          state: "Pending"
        });
    
        if (!cart) {
          cart = em.create(Cart, {
            user: req.user.id,
            state: "Pending",
            total: 0,
          });
          await em.persistAndFlush(cart);
        } 
        const existingOrder = await em.findOne(Order, {
          cart: cart.id,
          product: product.id
        });
        if (existingOrder) {
          existingOrder.quantity += validationResult.data.quantity;
          existingOrder.subtotal += validationResult.data.subtotal;
          em.persist(existingOrder);
        } else {
          const order = em.create(Order, {
            quantity: validationResult.data.quantity,
            product: product,
            cart: cart,
            subtotal: validationResult.data.subtotal,
          });
          em.persist(order);
        }
         // Actualizar stock del producto
         product.stock -= validationResult.data.quantity;

// Recalculate cart total
const orders = await cart.orders.loadItems();
cart.total = orders.reduce((sum, order) => sum + order.subtotal, 0);
        // SIEMPRE actualizar el total del carrito
        //cart.total += validationResult.data.subtotal;
        await cart.orders.init(); // asegurar que las órdenes estén cargadas
       
      
        await em.flush(); // Guardar todo junto
        res.status(201).json({ message: "Order added to cart", data: cart });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
    

    async function update(req: Request, res: Response) {
      try {
        const _id = new ObjectId(req.params.id);
        
        // Verify the order exists and belongs to current user
        const orderToUpdate = await em.findOneOrFail(Order, { 
          _id,
          cart: { user: req.user.id } // Ensure order belongs to current user
        }, { populate: ['product', 'cart'] });
    
        if (!orderToUpdate) {
          return res.status(404).json({ message: "Order not found" });
        }
    
        // Validate new quantity
        const newQuantity = req.body.quantity;
        if (typeof newQuantity !== "number" || newQuantity <= 0) {
          return res.status(400).json({ message: "Invalid quantity" });
        }
    
        // Calculate stock difference
        const quantityDifference = orderToUpdate.quantity - newQuantity;
        const product = orderToUpdate.product as Product;
    
        if (quantityDifference > 0) {
          // Quantity decreased - return stock
          product.stock += quantityDifference;
        } else if (quantityDifference < 0) {
          // Quantity increased - check stock
          const needed = Math.abs(quantityDifference);
          if (product.stock < needed) {
            return res.status(409).json({ message: "Not enough stock available" });
          }
          product.stock -= needed;
        }
    
        // Update order and cart total
        const pricePerUnit = orderToUpdate.subtotal / orderToUpdate.quantity;
        orderToUpdate.quantity = newQuantity;
        orderToUpdate.subtotal = pricePerUnit * newQuantity;
        
        // Update cart total
        const cart = orderToUpdate.cart as Cart;
        const orders = await cart.orders.loadItems();
        cart.total = orders.reduce((sum, order) => sum + order.subtotal, 0);
    
        await em.flush();
        res.status(200).json({ message: "Order updated", data: orderToUpdate });
      } catch (error: any) {
        if (error.name === "NotFoundError") {
          return res.status(404).json({ message: "Order not found" });
        }
        res.status(500).json({ message: error.message });
      }
    }
    
        async function remove(req: Request, res: Response) {
          try {
            const userId = req.user?.id;
        
            if (!userId) {
              return res.status(401).json({ message: 'Unauthorized' });
            }
        
            const _id = new ObjectId(req.params.id);
        
            const order = await em.findOneOrFail(Order, { _id }, { populate: ['cart','product'] });
            if (!order.cart || order.cart.user.id !== userId) {
              return res.status(403).json({ message: 'Forbidden: Not your order' });
            }
        
            if (order.cart.state === 'Completed') {
              return res.status(400).json({ message: 'Cannot remove order from completed cart' });
            }
           // Forzar a que `product` es un Product
           const product = order.product as Product;

           // Actualizar el stock
           product.stock += order.quantity;
           const cart = order.cart as Cart

           const subtotal = order.subtotal
           if (subtotal > 0) {
            cart.total -= subtotal
           }
           await em.persistAndFlush(product);
           await em.persistAndFlush(cart);
           await em.removeAndFlush(order);
           
            return res.status(200).json({ message: 'Order removed', data: order });
          } catch (error: any) {
            return res.status(500).json({ message: error.message });
          }
        }


export {findAll, findOne, add,update,remove}