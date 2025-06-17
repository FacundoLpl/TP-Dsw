import type { Request, Response } from "express"
import { Order } from "./order.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { validateOrder } from "./order.schema.js"
import { Product } from "../Product/product.entity.js"
import { Cart } from "../Cart/cart.entity.js"
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js"

const em = orm.em

// Make sure each function is properly exported
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
    // Ensure quantity is a number before validation
    if (req.body.quantity !== undefined) {
      req.body.quantity = Number(req.body.quantity)

      // Check if conversion resulted in a valid number
      if (isNaN(req.body.quantity)) {
        return res.status(400).json({
          message: "La cantidad debe ser un número válido",
        })
      }
    }

    // Ensure subtotal is a number
    if (req.body.subtotal !== undefined) {
      req.body.subtotal = Number(req.body.subtotal)

      // Check if conversion resulted in a valid number
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

    // Validación fuerte: si no existe, archivado o stock inválido
    if (
      !product ||
      product.state === "Archived" ||
      product.stock == null || // null o undefined
      typeof product.stock !== "number" ||
      isNaN(product.stock) || // <<<<<< ESTA es la que faltaba
      product.stock < validationResult.data.quantity
    ) {
      return res.status(400).json({ message: "Product not available" })
    }

    // Check if cart ID is provided directly
    let cart
    if (req.body.cart) {
      // If cart ID is provided, find that cart
      cart = await em.findOne(Cart, req.body.cart)
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
      }
    } else {
      // Otherwise find or create a pending cart for the user
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

    // Check if this product is already in the cart
    const existingOrder = await em.findOne(Order, {
      cart: cart.id,
      product: product.id,
    })

    if (existingOrder) {
      // Update existing order
      existingOrder.quantity += validationResult.data.quantity
      existingOrder.subtotal += validationResult.data.subtotal
      em.persist(existingOrder)

      // Log for debugging
      console.log(`Updated existing order: ${existingOrder.id}, new quantity: ${existingOrder.quantity}`)
    } else {
      // Create new order
      const order = em.create(Order, {
        quantity: validationResult.data.quantity,
        product: product,
        cart: cart,
        subtotal: validationResult.data.subtotal,
        productName: product.name || "Unknown Product",
      })
      em.persist(order)

      // Log for debugging
      console.log(`Created new order for product: ${product.id} in cart: ${cart.id}`)
    }

    // Update product stock
    product.stock -= validationResult.data.quantity

    // Recalculate cart total
    await cart.orders.init() // Ensure orders are loaded
    const orders = await cart.orders.loadItems()
    cart.total = orders.reduce((sum, order) => sum + order.subtotal, 0)

    await em.flush() // Save all changes

    // Return the updated cart with orders
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

    // Verify the order exists and belongs to current user
    const orderToUpdate = await em.findOneOrFail(
      Order,
      {
        _id,
        cart: { user: req.user.id }, // Ensure order belongs to current user
      },
      { populate: ["product", "cart"] },
    )

    if (!orderToUpdate) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Validate new quantity
    const newQuantity = req.body.quantity
    if (typeof newQuantity !== "number" || newQuantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" })
    }

    // Calculate stock difference
    const quantityDifference = orderToUpdate.quantity - newQuantity
    const product = orderToUpdate.product as Product

    if (quantityDifference > 0) {
      // Quantity decreased - return stock
      product.stock += quantityDifference
    } else if (quantityDifference < 0) {
      // Quantity increased - check stock
      const needed = Math.abs(quantityDifference)
      if (product.stock < needed) {
        return res.status(409).json({ message: "Not enough stock available" })
      }
      product.stock -= needed
    }

    // Update order and cart total
    const pricePerUnit = orderToUpdate.subtotal / orderToUpdate.quantity
    orderToUpdate.quantity = newQuantity
    orderToUpdate.subtotal = pricePerUnit * newQuantity

    // Update cart total
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
    console.log('🔍 BACKEND - Remove order called with ID:', req.params.id);
    console.log('🔍 BACKEND - User ID:', req.user?.id);

    if (!req.user || !req.user.id) {
      console.log('❌ BACKEND - No authentication');
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const _id = new ObjectId(req.params.id);
    
    console.log('🔍 BACKEND - Looking for order with ObjectId:', _id);

    // Populate cart.user para asegurar que tenemos acceso al usuario
    const order = await em.findOneOrFail(Order, { _id }, { 
      populate: ["cart", "cart.user", "product"] 
    });
    
    console.log('🔍 BACKEND - Found order:', order.id);

    // CORRECCIÓN: Desenvelver order.cart primero
    const cartRef = order.cart;
    console.log('🔍 BACKEND - Cart ref:', cartRef);

    // Verificar si order.cart es una referencia Ref
    let cart: Cart;
    if (cartRef && typeof cartRef === 'object' && 'unwrap' in cartRef) {
      cart = (cartRef as any).unwrap();
      console.log('🔍 BACKEND - Cart unwrapped:', cart);
    } else {
      cart = cartRef as Cart;
      console.log('🔍 BACKEND - Cart direct:', cart);
    }

    if (!cart) {
      console.log('❌ BACKEND - No cart found');
      return res.status(400).json({ message: "Order has no associated cart" });
    }

    // CORRECCIÓN: Ahora desenvelver cart.user
    const userRef = cart.user;
    console.log('🔍 BACKEND - User ref:', userRef);

    let cartUserId: string;
    if (userRef && typeof userRef === 'object' && 'unwrap' in userRef) {
      const user = (userRef as any).unwrap();
      cartUserId = user.id || user._id?.toString();
      console.log('🔍 BACKEND - Cart user ID (unwrapped):', cartUserId);
    } else if (userRef && typeof userRef === 'object' && 'id' in userRef) {
      cartUserId = (userRef as any).id;
      console.log('🔍 BACKEND - Cart user ID (direct):', cartUserId);
    } else if (typeof userRef === 'string') {
      cartUserId = userRef;
      console.log('🔍 BACKEND - Cart user ID (string):', cartUserId);
    } else {
      console.log('❌ BACKEND - Cannot determine cart user ID');
      console.log('🔍 BACKEND - User ref type:', typeof userRef);
      console.log('🔍 BACKEND - User ref value:', userRef);
      return res.status(400).json({ message: "Cannot determine cart owner" });
    }
    
    console.log('🔍 BACKEND - Comparing user IDs:', { cartUserId, userId });

    if (cartUserId !== userId) {
      console.log('❌ BACKEND - Forbidden: Not user\'s order');
      return res.status(403).json({ message: "Forbidden: Not your order" });
    }

    if (cart.state === "Completed") {
      console.log('❌ BACKEND - Cart already completed');
      return res.status(400).json({ message: "Cannot remove order from completed cart" });
    }

    // Actualizar stock del producto
    const product = order.product as Product;
    console.log('🔍 BACKEND - Updating product stock:', product.id);
    product.stock += order.quantity;

    // Actualizar total del carrito
    const subtotal = order.subtotal;
    if (subtotal > 0) {
      cart.total -= subtotal;
    }

    console.log('🔍 BACKEND - Updated cart total:', cart.total);

    // Persistir cambios
    await em.persistAndFlush([product, cart]);
    await em.removeAndFlush(order);

    console.log('✅ BACKEND - Order removed successfully');
    return res.status(200).json({ message: "Order removed", data: order });

  } catch (error: any) {
    console.error('❌ BACKEND - Error in remove method:', error);
    console.error('❌ BACKEND - Error stack:', error.stack);
    
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.status(500).json({ 
      message: error.message,
      details: error.stack 
    });
  }
}