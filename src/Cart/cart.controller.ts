import { Request, Response } from "express"
import { Cart } from "./cart.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js"

const em = orm.em

export async function findAll(req: AuthenticatedRequest, res: Response) {
  try {
    const filter: any = {}

    // Apply filters if provided in query params
    if (req.query.state) {
      filter.state = req.query.state
    }

    if (req.query.user) {
      filter.user = req.query.user
    } else if (req.user) {
      // If no user filter provided, use the authenticated user
      filter.user = req.user.id
    }

    // Filter by deliveryType (string property)
    if (req.query.deliveryType) {
      filter.deliveryType = req.query.deliveryType
    }

    // Filter by shipmentType (reference to ShipmentType entity)
    if (req.query.shipmentType) {
      filter.shipmentType = req.query.shipmentType
    }

    const carts = await em.find(Cart, filter, {
      populate: ["orders", "orders.product", "user", "shipmentType"],
    })

    res.status(200).json({ message: "found all carts", data: carts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function findOne(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(
      Cart,
      { _id },
      {
        populate: ["orders", "orders.product", "user", "shipmentType"],
      },
    )

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to access this cart" })
    }

    res.status(200).json({ message: "found cart", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function add(req: AuthenticatedRequest, res: Response) {
  try {
    // If no user provided in the request body, use the authenticated user
    if (!req.body.user && req.user) {
      req.body.user = req.user.id
    }

    // Handle shipmentType reference if provided
    if (req.body.shipmentType && typeof req.body.shipmentType === "string") {
      try {
        const shipmentTypeId = new ObjectId(req.body.shipmentType)
        req.body.shipmentType = em.getReference("ShipmentType", shipmentTypeId)
      } catch (error) {
        return res.status(400).json({ message: "Invalid shipmentType ID" })
      }
    }

    const cart = em.create(Cart, req.body)
    await em.persistAndFlush(cart)
    res.status(201).json({ message: "cart created", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function update(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(Cart, { _id })

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to update this cart" })
    }

    // Handle shipmentType reference if provided
    if (req.body.shipmentType && typeof req.body.shipmentType === "string") {
      try {
        const shipmentTypeId = new ObjectId(req.body.shipmentType)
        req.body.shipmentType = em.getReference("ShipmentType", shipmentTypeId)
      } catch (error) {
        return res.status(400).json({ message: "Invalid shipmentType ID" })
      }
    }

    // Update cart properties
    em.assign(cart, req.body)
    await em.flush()

    res.status(200).json({ message: "cart updated", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(Cart, { _id })

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to delete this cart" })
    }

    await em.removeAndFlush(cart)
    res.status(200).json({ message: "cart removed", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function removeOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(Cart, { _id }, { populate: ["orders"] })

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to modify this cart" })
    }

    // Remove all orders from the cart
    await em.nativeDelete("Order", { cart: cart.id })

    // Reset cart total
    cart.total = 0
    await em.flush()

    res.status(200).json({ message: "all orders removed from cart", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function addOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(Cart, { _id })

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to modify this cart" })
    }

    // Create a new order
    const order = em.create("Order", {
      ...req.body,
      cart: cart,
    }) as { subtotal: number } // Explicitly type order

    await em.persistAndFlush(order)

    // Update cart total
    cart.total += order.subtotal
    await em.flush()

    res.status(201).json({ message: "order added to cart", data: order })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function getCartWithOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)

    // Find the cart with all its orders and products
    const cart = await em.findOneOrFail(
      Cart,
      { _id },
      {
        populate: ["orders", "orders.product", "user"],
      },
    )

    // Check if the cart belongs to the current user or user is admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to access this cart" })
    }

    res.status(200).json({ message: "found cart with orders", data: cart })
  } catch (error: any) {
    // If cart not found, create a new one
    if (error.name === "NotFoundError" && req.user) {
      try {
        const newCart = em.create(Cart, {
          user: req.user.id,
          state: "Pending",
          total: 0,
        })
        await em.persistAndFlush(newCart)

        res.status(200).json({ message: "created new cart", data: newCart })
      } catch (createError: any) {
        res.status(500).json({ message: createError.message })
      }
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}
export async function findUserOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Buscar carritos completados del usuario
    const completedCarts = await em.find(Cart, 
      { 
        user: userId, 
        state: "Completed" 
      }, 
      {
        populate: ["orders", "orders.product", "user"],
        orderBy: { _id: 'DESC' } // Más recientes primero, use _id if createdAt does not exist
      }
    );

    res.status(200).json({ 
      message: "found user orders", 
      data: completedCarts 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
