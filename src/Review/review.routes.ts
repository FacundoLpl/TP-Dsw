import Router from 'express';
import { findAll, findOne, add, update, remove } from './review.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
export const reviewRouter = Router();

reviewRouter.get('/', authenticateToken, findAll);
reviewRouter.get('/:id', authenticateToken, findOne);
reviewRouter.post('/', authenticateToken, add);
reviewRouter.put('/:id', authenticateToken, update);
reviewRouter.patch('/:id', authenticateToken, update);
reviewRouter.delete('/:id', authenticateToken, remove);
