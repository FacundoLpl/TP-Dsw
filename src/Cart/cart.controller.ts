import { Response } from "express"
import { Cart } from "./cart.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js"

const em = orm.em

export async function findAll(req: AuthenticatedRequest, res: Response) {
  try {
    const filter: any = {}
    if (req.query.state) {
      filter.state = req.query.state
    } // Filtra por estado del carrito
    if (req.query.user) {
      filter.user = req.query.user
    } else if (req.user) {
      filter.user = req.user.id
    } // Filtra por usuario, si no se proporciona, usa el usuario autenticado
    if (req.query.deliveryType) {
      filter.deliveryType = req.query.deliveryType
    }
    // Filtra por tipo de envío si se proporciona
    if (req.query.shipmentType) {
      filter.shipmentType = req.query.shipmentType
    }
    const carts = await em.find(Cart, filter, {
      populate: ["orders", "orders.product", "user", "shipmentType"],
    }) // Obtiene todos los carritos con sus órdenes, productos, usuario y tipo de envío

    res.status(200).json({ message: "found all carts", data: carts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  } // Maneja errores y envía una respuesta de error
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
    ) // Busca un carrito por ID y lo llena con órdenes, productos, usuario y tipo de envío

    // Checkea si el carrito pertenece al usuario actual o si el usuario es admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to access this cart" })
    }

    res.status(200).json({ message: "found cart", data: cart })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  } // Maneja errores y envía una respuesta de error
}
export async function add(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.body.user && req.user) {
      req.body.user = req.user.id
    }

    // Maneja la referencia de shipmentType si se proporciona
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
    res.status(201).json({ message: "cart created", data: cart })// Crea un nuevo carrito y lo guarda en la base de datos
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
export async function update(req: AuthenticatedRequest, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const cart = await em.findOneOrFail(Cart, { _id })

    // Valida si el carrito pertenece al usuario actual o si el usuario es admin
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to update this cart" })
    }
    if (req.body.shipmentType && typeof req.body.shipmentType === "string") {
      try {
        const shipmentTypeId = new ObjectId(req.body.shipmentType)
        req.body.shipmentType = em.getReference("ShipmentType", shipmentTypeId)
      } catch (error) {
        return res.status(400).json({ message: "Invalid shipmentType ID" })
      }
    }

    // Actualiza el carrito con los datos proporcionados
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

    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to modify this cart" })
    }

    // Elimina todas las órdenes del carrito
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
    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to modify this cart" })
    }
    const order = em.create("Order", {
      ...req.body,
      cart: cart,
    }) as { subtotal: number } 

    await em.persistAndFlush(order)

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

    // Encuentra el carrito por ID y llena las órdenes, productos y usuario
    const cart = await em.findOneOrFail(
      Cart,
      { _id },
      {
        populate: ["orders", "orders.product", "user"],
      },
    )

    if (cart.user.id !== req.user?.id && req.user?.userType !== "Admin") {
      return res.status(403).json({ message: "You don't have permission to access this cart" })
    }

    res.status(200).json({ message: "found cart with orders", data: cart })
  } catch (error: any) {
    // Si el carrito no se encuentra, intenta crear uno nuevo
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
        orderBy: { _id: 'DESC' } // Más recientes primero, usa _id si createdAt no existe
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
