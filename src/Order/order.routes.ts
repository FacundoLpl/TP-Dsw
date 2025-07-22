import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./order.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Endpoints para pedidos (orders)
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Order]
 *     summary: Obtener todos los pedidos (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autorizado
 */
orderRouter.get("/", authenticateToken, isAdmin, findAll);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Order]
 *     summary: Obtener un pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido no encontrado
 */
orderRouter.get("/:id", authenticateToken, findOne);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Order]
 *     summary: Crear un nuevo pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error en la petición
 */
orderRouter.post("/", authenticateToken, add);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags: [Order]
 *     summary: Actualizar un pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del pedido a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *       404:
 *         description: Pedido no encontrado
 */
orderRouter.put("/:id", authenticateToken, update);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Order]
 *     summary: Eliminar un pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del pedido a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido eliminado
 *       404:
 *         description: Pedido no encontrado
 */
orderRouter.delete("/:id", authenticateToken, remove);
