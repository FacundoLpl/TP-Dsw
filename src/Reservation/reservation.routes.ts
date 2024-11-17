import { Router } from "express";
import { findAll, findOne, add, update, remove} from "./reservation.controller.js";

export const reservationRouter = Router()

reservationRouter.get('/', findAll)
reservationRouter.get('/:id', findOne)
reservationRouter.post('/', add)
reservationRouter.put('/:id', update)
reservationRouter.delete('/:id', remove)