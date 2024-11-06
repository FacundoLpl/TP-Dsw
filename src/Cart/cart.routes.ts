import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./cart.controller.js";
import { orderRouter } from "../Order/order.routes.js";

export const cartRouter = Router()

cartRouter.get('/', findAll)
cartRouter.get('/:id', findOne)
cartRouter.post('/', add)
cartRouter.put('/:id', update)
cartRouter.delete('/:id', remove)

cartRouter.use('/:id/orders', orderRouter)
