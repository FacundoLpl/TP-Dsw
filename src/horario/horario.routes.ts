import { Router } from "express";
import { sanitizehorarioInput, findAll, findOne, add, update, remove} from "./horario.controler.js";

export const horarioRouter = Router()

horarioRouter.get('/', findAll)
horarioRouter.get('/:idHorario', findOne)
horarioRouter.post('/', sanitizehorarioInput, add)
horarioRouter.put('/:idHorario', sanitizehorarioInput, update)
horarioRouter.patch('/:idHorario', sanitizehorarioInput, update)
horarioRouter.delete('/:idHorario', sanitizehorarioInput, remove)
