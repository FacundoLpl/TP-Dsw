import { Router } from "express";
import { /*sanitizecategoryInput, */findAll, findOne, add, update, remove} from "./category.controller.js";

export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:id', findOne)
categoryRouter.post('/', /*sanitizecategoryInput,*/ add)
categoryRouter.put('/:id', /*sanitizecategoryInput,*/ update)
//categoryRouter.patch('/:id', sanitizecategoryInput, update)
categoryRouter.delete('/:id', /*sanitizecategoryInput,*/ remove)
