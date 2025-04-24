import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./category.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:id', findOne)
categoryRouter.post('/',authenticateToken, add)
categoryRouter.put('/:id',authenticateToken, update)
categoryRouter.delete('/:id',authenticateToken, remove)
