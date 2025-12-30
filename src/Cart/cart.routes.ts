import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  findUserOrders,
  getTotalCarts,
  getTotalRevenue
} from "./cart.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const cartRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Endpoints para carritos de compra
 */

/**
 * @swagger
 * /carts:
 *   get:
 *     tags: [Cart]
 *     summary: Obtener todos los carritos (solo autenticados)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
cartRouter.get("/", authenticateToken, findAll);
// NUEVAS RUTAS PARA DASHBOARD - solo admin
cartRouter.get("/total", authenticateToken, isAdmin, getTotalCarts);
cartRouter.get("/total-revenue", authenticateToken, isAdmin, getTotalRevenue);

/**
 * @swagger
 * /carts/my-orders:
 *   get:
 *     tags: [Cart]
 *     summary: Obtener mis pedidos asociados al carrito
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
cartRouter.get("/my-orders", authenticateToken, findUserOrders);

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     tags: [Cart]
 *     summary: Obtener un carrito por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado
 */
cartRouter.get("/:id", authenticateToken, findOne);

/**
 * @swagger
 * /carts:
 *   post:
 *     tags: [Cart]
 *     summary: Crear un nuevo carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Carrito creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Error en la petición
 */
cartRouter.post("/", authenticateToken, add);

/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Actualizar un carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del carrito a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       404:
 *         description: Carrito no encontrado
 */
cartRouter.put("/:id", authenticateToken, update);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Eliminar un carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del carrito a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito eliminado
 *       404:
 *         description: Carrito no encontrado
 */
cartRouter.delete("/:id", authenticateToken, remove);
