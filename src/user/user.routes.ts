import { Router } from "express";
import {findAll, findOne, add, update, remove, login} from "./user.controller.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.post('/', add)
userRouter.put('/:id', update)
userRouter.delete('/:id', remove)

userRouter.post('/login', login)
