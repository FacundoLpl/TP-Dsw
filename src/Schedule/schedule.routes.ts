import { Router } from "express";
import {findAll, findOne, add, update, remove} from "./schedule.controller.js"

export const scheduleRouter = Router()

scheduleRouter.get('/', findAll)
scheduleRouter.get('/:id', findOne)
scheduleRouter.post('/', add)
scheduleRouter.put('/:id', update)
scheduleRouter.delete('/:id', remove)
