import { Router } from "express";
import {findAll, findOne, add, update, remove} from "./user.controller.js";

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.post('/', add)
userRouter.put('/:id', update)
userRouter.delete('/:id', remove)
