import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./order.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const orderRouter = Router()

orderRouter.get('/', authenticateToken, isAdmin, findAll)
orderRouter.get('/:id', authenticateToken, findOne)
orderRouter.post('/', authenticateToken, add)
orderRouter.put('/:id', authenticateToken, update)
orderRouter.delete('/:id', authenticateToken, remove)
