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
    
        // SIEMPRE actualizar el total del carrito
        cart.total += validationResult.data.subtotal;
    
        validationResult.data.cart = cart.id;
        await cart.orders.init(); // asegurar que las órdenes estén cargadas
    
        const existingOrder = cart.orders.getItems().find(order => {
          const orderProductId = order.product instanceof Product ? order.product.id : order.product;
          return orderProductId === product.id;
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
        em.persist(product);
    
        em.persist(cart); // por si el total cambió
        await em.flush(); // Guardar todo junto
    
        res.status(201).json({ message: "Order added to cart", data: cart });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
    

    async function update(req: Request, res: Response) {
      try {
        const _id = new ObjectId(req.params.id);
        
        // Cargar la orden real (populate product para poder acceder)
        const orderToUpdate = await em.findOneOrFail(Order, { _id }, { populate: ['product'] });
    
        const oldQuantity = orderToUpdate.quantity;
        const newQuantity = req.body.quantity;
    
        if (typeof newQuantity !== "number" || newQuantity <= 0) {
          return res.status(400).json({ message: "Invalid quantity" });
        }
    
        // Calcular la diferencia
        const quantityDifference = oldQuantity - newQuantity;
    
        if (quantityDifference !== 0) {
          const product = orderToUpdate.product as Product;
    
          if (quantityDifference > 0) {
            // Se redujo la cantidad -> DEVOLVER stock al producto
            product.stock += quantityDifference;
          } else {
            // Se aumentó la cantidad -> QUITAR stock al producto
            const needed = Math.abs(quantityDifference);
            if (product.stock < needed) {
              return res.status(400).json({ message: "Not enough stock to increase order" });
            }
            product.stock -= needed;
          }
          
          em.persist(product); // Persistir el cambio de stock
        }
    
        em.assign(orderToUpdate, req.body); // Actualizar los campos de la orden
        await em.flush();
    
        res.status(200).json({ message: "Order updated", data: orderToUpdate });
      } catch (error: any) {
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
           await em.persistAndFlush(product);

            await em.removeAndFlush(order);
        
            return res.status(200).json({ message: 'Order removed', data: order });
          } catch (error: any) {
            return res.status(500).json({ message: error.message });
          }
        }


export {findAll, findOne, add,update,remove}