import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./order.controller.js";

export const orderRouter = Router()

orderRouter.get('/', findAll)
orderRouter.get('/:id', findOne)
orderRouter.post('/', add)
orderRouter.put('/:id', update)
orderRouter.delete('/:id', remove)
