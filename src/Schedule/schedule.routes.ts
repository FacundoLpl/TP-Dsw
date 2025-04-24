import { Router } from "express";
import {findAll, findOne, add, update, remove} from "./schedule.controller.js"
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
export const scheduleRouter = Router()

scheduleRouter.get('/', findAll)
scheduleRouter.get('/:id', findOne)
scheduleRouter.post('/',authenticateToken, isAdmin, add)
scheduleRouter.put('/:id',authenticateToken, isAdmin, update)
scheduleRouter.delete('/:id',authenticateToken, isAdmin, remove)
