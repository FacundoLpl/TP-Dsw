import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./cart.controller.js";
import { orderRouter } from "../Order/order.routes.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { findUserOrders } from "./cart.controller.js"; 
export const cartRouter = Router()

cartRouter.get('/', authenticateToken,  findAll)
cartRouter.get('/my-orders', authenticateToken, findUserOrders) 
cartRouter.get('/:id', authenticateToken,  findOne)
cartRouter.post('/', authenticateToken,  add)
cartRouter.put('/:id', authenticateToken,  update)
cartRouter.delete('/:id', authenticateToken,  remove)

