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
          // Imprimir los datos recibidos en la solicitud
          console.log('Request Body:', req.body);
  
          // Crear una nueva instancia de Cart con los datos recibidos
          const cart = em.create(Cart, req.body);
  
          // Si hay órdenes en el body, asocia las órdenes al carrito
          const { orders } = req.body;
          if (orders && Array.isArray(orders)) {
              for (const order of orders) {
                  const validationResult = validateOrder(order); // Validar la orden
                  if (!validationResult.success) {
                      throw new Error(validationResult.error.message);
                  }
  
                  // Crear la orden y asociarla al carrito
                  const newOrder = em.create(Order, { ...order, cart });
                  cart.orders.add(newOrder); // Asociar la nueva orden al carrito
              }
  
              // Calcular el total del carrito después de agregar las órdenes (opcional)
              cart.total = cart.orders.getItems().reduce((sum, order) => sum + order.subtotal, 0);
          }
  
          // Persistir el carrito con sus órdenes
          await em.persistAndFlush(cart);
  
          // Enviar la respuesta con el carrito recién creado
          res.status(201).json({ message: 'Cart created successfully', data: cart });
  
      } catch (error: any) {
          console.error('Error creating cart:', error);
          res.status(500).json({ message: error.message });
      }
  }


    async function update(req: Request, res: Response) {
      try {
          // Imprimir los datos recibidos en la solicitud
          console.log('Request Body:', req.body);
  
          // Extrae el ID del carrito desde la URL
          const cartId = req.params.id;
  
          // Busca el carrito para actualizar
          const cartToUpdate = await em.findOneOrFail(Cart, { id: cartId }, { populate: ['orders'] });
  
          // Asigna los datos del carrito recibidos en `req.body` a `cartToUpdate`
          const { state, deliveryType, deliveryAddress, paymentMethod, contactNumber, additionalInstructions, orders } = req.body;
          em.assign(cartToUpdate, {
              state,
              deliveryType,
              deliveryAddress,
              paymentMethod,
              contactNumber,
              additionalInstructions
          });
  
          // Procesa y actualiza cada orden en el carrito
          for (const order of orders) {
              const validationResult = validateOrder(order);
  
              if (!validationResult.success) {
                  throw new Error(validationResult.error.message);
              }
  
              // Verifica si la orden ya existe
              let orderToUpdate = await em.findOne(Order, { id: order.id });
              if (orderToUpdate) {
                  em.assign(orderToUpdate, order); // Actualiza la orden existente
              } else {
                  // Crea una nueva orden si no existe
                  orderToUpdate = em.create(Order, order);
                  cartToUpdate.orders.add(orderToUpdate);
              }
  
              // Valida el stock del producto asociado
              const product = await em.findOneOrFail(Product, { id: order.product.id, state: 'Active' });
              if (product.stock < order.quantity) {
                  throw new Error(`Product stock is insufficient for product ID ${order.product.id}`);
              }
              product.stock -= order.quantity; // Resta el stock
              await em.persistAndFlush(product);
          }
  
          // Si todas las órdenes se procesan correctamente, marca el carrito como completado
          if (cartToUpdate.orders.getItems().every(order => order.state === 'Completed')) {
              cartToUpdate.state = 'Completed';
          }
  
          // Guarda los cambios en el carrito
          await em.flush();
  
          res.status(200).json({ message: 'Cart and orders updated successfully', data: cartToUpdate });
      } catch (error: any) {
          console.error('Error updating cart and orders:', error);
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