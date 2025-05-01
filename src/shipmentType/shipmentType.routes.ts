import { Router } from "express";
import {findAll, findOne, add, update, remove} from "./shipmentType.controller.js"
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js"
export const shipmentTypeRouter = Router()

shipmentTypeRouter.get('/', findAll)
shipmentTypeRouter.get('/:id', findOne)
shipmentTypeRouter.post('/',authenticateToken, isAdmin, add)
shipmentTypeRouter.put('/:id',authenticateToken, isAdmin, update)
shipmentTypeRouter.delete('/:id',authenticateToken, isAdmin, remove)
