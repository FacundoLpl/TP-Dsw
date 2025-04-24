import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./reservation.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const reservationRouter = Router();

// Admin puede ver todas
reservationRouter.get('/', authenticateToken, isAdmin, findAll);

// Acciones que requieren login
reservationRouter.get('/:id', authenticateToken, findOne);
reservationRouter.post('/', authenticateToken, add);
reservationRouter.put('/:id', authenticateToken, update);
reservationRouter.delete('/:id', authenticateToken, remove);
