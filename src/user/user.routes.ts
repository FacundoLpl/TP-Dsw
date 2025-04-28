import { Router } from "express";
import {findAll, findOne, add, update, remove, login} from "./user.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRouter = Router()

userRouter.get('/', authenticateToken, isAdmin, findAll)
userRouter.get('/:id', authenticateToken, findOne)
userRouter.post('/', authenticateToken, isAdmin, add)
userRouter.put('/:id', authenticateToken, update)
userRouter.delete('/:id', authenticateToken, isAdmin,remove)

userRouter.post('/login', login)
