import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./product.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/:id', findOne)
productRouter.post('/',authenticateToken, add)
productRouter.put('/:id',authenticateToken, isAdmin, update)
productRouter.delete('/:id', authenticateToken, isAdmin,remove)
