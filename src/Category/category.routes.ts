import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./category.controller.js";

export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:id', findOne)
categoryRouter.post('/', add)
categoryRouter.put('/:id', update)
categoryRouter.delete('/:id', remove)
