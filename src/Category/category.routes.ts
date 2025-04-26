import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./category.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:id', findOne)


categoryRouter.use(authenticateToken); 

categoryRouter.post('/', add)
categoryRouter.put('/:id', update)
categoryRouter.delete('/:id', remove)
