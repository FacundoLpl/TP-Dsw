import type { Request, Response } from "express"
import { Order } from "./order.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { validateOrder } from "./order.schema.js"
import { Product } from "../Product/product.entity.js"
import { Cart } from "../Cart/cart.entity.js"
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js"

const em = orm.em

export async function findAll(req: Request, res: Response) {
  try {
    const orders = await em.find("Order", {})
    res.status(200).json({ message: "found all orders", data: orders })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const order = await em.findOneOrFail(Order, { _id }) // primer parametro la clase, 2do el filtro
    res.status(200).json({ message: "found order", data: order })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function add(req: AuthenticatedRequest, res: Response) {
  try {    
    if (req.body.quantity !== undefined) {
      req.body.quantity = Number(req.body.quantity)

      if (isNaN(req.body.quantity)) {
        return res.status(400).json({
          message: "La cantidad debe ser un número válido",
        })
      }
    }
    if (req.body.subtotal !== undefined) {
      req.body.subtotal = Number(req.body.subtotal)

      if (isNaN(req.body.subtotal)) {
        return res.status(400).json({
          message: "El subtotal debe ser un número válido",
        })
      }
    }

    const validationResult = validateOrder(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.message })
    }

    const product = await em.findOne(Product, validationResult.data.product)
    if (
      !product ||
      product.state === "Archived" ||
      product.stock == null || // null o undefined
      typeof product.stock !== "number" ||
      isNaN(product.stock) || 
      product.stock < validationResult.data.quantity
    ) {
      return res.status(400).json({ message: "Product not available" })
    }

    // Valida si el cart ya existe o si se debe crear uno nuevo
    let cart
    if (req.body.cart) {
      cart = await em.findOne(Cart, req.body.cart)
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
      }
    } else {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" })
      }
      cart = await em.findOne(Cart, {
        user: req.user.id,
        state: "Pending",
      })
      if (!cart) {
        cart = em.create(Cart, {
          user: req.user.id,
          state: "Pending",
          total: 0,
        })
        await em.persistAndFlush(cart)
      }
    }
      const existingOrder = await em.findOne(Order, {
      cart: cart.id,
      product: product.id,
    })

    if (existingOrder) {
      existingOrder.quantity += validationResult.data.quantity
      existingOrder.subtotal += validationResult.data.subtotal
      em.persist(existingOrder)
    } else {
      const order = em.create(Order, {
        quantity: validationResult.data.quantity,
        product: product,
        cart: cart,
        subtotal: validationResult.data.subtotal,
        productName: product.name || "Unknown Product",
      })
      em.persist(order)
    }
    product.stock -= validationResult.data.quantity
    
    await cart.orders.init()
    const orders = await cart.orders.loadItems()
    cart.total = orders.reduce((sum, order) => sum + order.subtotal, 0)

    await em.flush() 
    const updatedCart = await em.findOne(Cart, cart.id, {
      populate: ["orders", "orders.product"],
    })

    res.status(201).json({ message: "Order added to cart", data: updatedCart })
  } catch (error: any) {
    console.error("Error adding order:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function update(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" })
    }
    const orderToUpdate = await em.findOneOrFail(
      Order,
      {
        _id,
        cart: { user: req.user.id },
      },
      { populate: ["product", "cart"] },
    )

    if (!orderToUpdate) {
      return res.status(404).json({ message: "Order not found" })
    }

    const newQuantity = req.body.quantity
    if (typeof newQuantity !== "number" || newQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" })
    }
    const quantityDifference = orderToUpdate.quantity - newQuantity
    const product = orderToUpdate.product as Product

    if (quantityDifference > 0) {
     
      product.stock += quantityDifference
    } else if (quantityDifference < 0) {
     
      const needed = Math.abs(quantityDifference)
      if (product.stock < needed) {
        return res.status(409).json({ message: "Not enough stock available" })
      }
      product.stock -= needed
    }

    // Actualizar subtotal
    const pricePerUnit = orderToUpdate.subtotal / orderToUpdate.quantity
    orderToUpdate.quantity = newQuantity
    orderToUpdate.subtotal = pricePerUnit * newQuantity

    // Actualiza el total del carrito
    const cart = orderToUpdate.cart as Cart
    const orders = await cart.orders.loadItems()
    cart.total = orders.reduce((sum, order) => sum + order.subtotal, 0)

    await em.flush()
    res.status(200).json({ message: "Order updated", data: orderToUpdate })
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(500).json({ message: error.message })
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    const _id = new ObjectId(req.params.id);
    const order = await em.findOneOrFail(Order, { _id }, { 
      populate: ["cart", "cart.user", "product"] 
    });

    const cartRef = order.cart;
    let cart: Cart;
    if (cartRef && typeof cartRef === 'object' && 'unwrap' in cartRef) {
      cart = (cartRef as any).unwrap();

    } else {
      cart = cartRef as Cart;
      
    }

    if (!cart) {
      return res.status(400).json({ message: "Order has no associated cart" });
    }
    const userRef = cart.user;
    let cartUserId: string;
    if (userRef && typeof userRef === 'object' && 'unwrap' in userRef) {
      const user = (userRef as any).unwrap();
      cartUserId = user.id || user._id?.toString();

    } else if (userRef && typeof userRef === 'object' && 'id' in userRef) {
      cartUserId = (userRef as any).id;

    } else if (typeof userRef === 'string') {
      cartUserId = userRef;

    } else {
      return res.status(400).json({ message: "Cannot determine cart owner" });
    }
    
    if (cartUserId !== userId) {
    
      return res.status(403).json({ message: "Forbidden: Not your order" });
    }

    if (cart.state === "Completed") {
    
      return res.status(400).json({ message: "Cannot remove order from completed cart" });
    }

    // Actualizar stock del producto
    const product = order.product as Product;
    
    product.stock += order.quantity;

    // Actualizar total del carrito
    const subtotal = order.subtotal;
    if (subtotal > 0) {
      cart.total -= subtotal;
    }
    // Persistir cambios
    await em.persistAndFlush([product, cart]);
    await em.removeAndFlush(order);

    return res.status(200).json({ message: "Order removed", data: order });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(500).json({ 
      message: error.message,
      details: error.stack 
    });
  }
}



