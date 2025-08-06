import Router from 'express';
import { findAll, findOne, add, update, remove } from './review.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { findByProductId } from './review.controller.js'

export const reviewRouter = Router();

reviewRouter.get('/', findAll);
reviewRouter.get('/product/:productId', findByProductId)
reviewRouter.get('/:id',findOne);
reviewRouter.post('/', authenticateToken, add);
reviewRouter.put('/:id', authenticateToken, update);
reviewRouter.patch('/:id', authenticateToken, update);
reviewRouter.delete('/:id', authenticateToken, remove);
