import { Router } from "express";
import { sanitizescheduleInput, findAll, findOne, add, update, remove} from "./schedule.controler.js";

export const scheduleRouter = Router()

scheduleRouter.get('/', findAll)
scheduleRouter.get('/:idSchedule', findOne)
scheduleRouter.post('/', sanitizescheduleInput, add)
scheduleRouter.put('/:idSchedule', sanitizescheduleInput, update)
scheduleRouter.patch('/:idSchedule', sanitizescheduleInput, update)
scheduleRouter.delete('/:idSchedule', sanitizescheduleInput, remove)
