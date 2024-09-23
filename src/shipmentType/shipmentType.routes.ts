import { Router } from "express";
import {findAll, findOne, add, update, remove} from "./shipmentType.controller.js"

export const shipmentTypeRouter = Router()

shipmentTypeRouter.get('/', findAll)
shipmentTypeRouter.get('/:id', findOne)
shipmentTypeRouter.post('/', add)
shipmentTypeRouter.put('/:id', update)
shipmentTypeRouter.delete('/:id', remove)
