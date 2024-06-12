import { Router } from "express";
import { sanitizeshipmentTypeInput, findAll, findOne, add, update, remove} from "./shipmentType.controler.js";

export const shipmentTypeRouter = Router()

shipmentTypeRouter.get('/', findAll)
shipmentTypeRouter.get('/:typeId', findOne)
shipmentTypeRouter.post('/', sanitizeshipmentTypeInput, add)
shipmentTypeRouter.put('/:typeId', sanitizeshipmentTypeInput, update)
shipmentTypeRouter.patch('/:typeId', sanitizeshipmentTypeInput, update)
shipmentTypeRouter.delete('/:typeId', sanitizeshipmentTypeInput, remove)
