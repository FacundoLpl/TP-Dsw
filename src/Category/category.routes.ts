import { Router } from "express";
import { sanitizecategoryInput, findAll, findOne, add, update, remove} from "./category.controller.js";

export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:catId', findOne)
categoryRouter.post('/', sanitizecategoryInput, add)
categoryRouter.put('/:catId', sanitizecategoryInput, update)
categoryRouter.patch('/:catId', sanitizecategoryInput, update)
categoryRouter.delete('/:catId', sanitizecategoryInput, remove)
