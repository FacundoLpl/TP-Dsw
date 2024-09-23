import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./product.controller.js";

export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/:id', findOne)
productRouter.post('/', add)
productRouter.put('/:id', update)
productRouter.delete('/:id', remove)
