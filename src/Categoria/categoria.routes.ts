import { Router } from "express";
import { sanitizecategoriaInput, findAll, findOne, add, update, remove} from "./categoria.controller.js";

export const categoriaRouter = Router()

categoriaRouter.get('/', findAll)
categoriaRouter.get('/:catId', findOne)
categoriaRouter.post('/', sanitizecategoriaInput, add)
categoriaRouter.put('/:catId', sanitizecategoriaInput, update)
categoriaRouter.patch('/:catId', sanitizecategoriaInput, update)
categoriaRouter.delete('/:catId', sanitizecategoriaInput, remove)
