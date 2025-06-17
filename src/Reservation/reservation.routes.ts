import { Router } from "express";
import { findAll, findOne, add, update, remove, findByUser, findPendingByUser } from "./reservation.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const reservationRouter = Router();

// Admin puede ver todas
reservationRouter.get('/', authenticateToken, isAdmin, findAll);

// Nuevas rutas para usuarios
reservationRouter.get('/user/all', authenticateToken, findByUser);        // Todas las reservas del usuario
reservationRouter.get('/user/pending', authenticateToken, findPendingByUser); // Solo la pendiente

// Acciones que requieren login
reservationRouter.get('/:id', authenticateToken, findOne);
reservationRouter.post('/', authenticateToken, add); 
reservationRouter.put('/:id', authenticateToken, update);
reservationRouter.delete('/:id', authenticateToken, remove);