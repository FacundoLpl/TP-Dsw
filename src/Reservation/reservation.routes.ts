import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  findByUser,
  findPendingByUser,
} from "./reservation.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const reservationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: Endpoints para reservas
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags: [Reservation]
 *     summary: Obtener todas las reservas (admin o autorizado)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
reservationRouter.get("/", authenticateToken, isAdmin,findAll);

/**
 * @swagger
 * /reservations/user/all:
 *   get:
 *     tags: [Reservation]
 *     summary: Obtener todas las reservas del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
reservationRouter.get("/user/all", authenticateToken, findByUser);

/**
 * @swagger
 * /reservations/user/pending:
 *   get:
 *     tags: [Reservation]
 *     summary: Obtener reserva pendiente del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reserva pendiente encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: No se encontró reserva pendiente
 */
reservationRouter.get("/user/pending", authenticateToken, findPendingByUser);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     tags: [Reservation]
 *     summary: Obtener una reserva por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.get("/:id", authenticateToken, findOne);

/**
 * @swagger
 * /reservations:
 *   post:
 *     tags: [Reservation]
 *     summary: Crear una nueva reserva
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reserva creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Error en la petición
 */
reservationRouter.post("/", authenticateToken, add);

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     tags: [Reservation]
 *     summary: Actualizar una reserva
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reserva actualizada
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.put("/:id", authenticateToken, update);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     tags: [Reservation]
 *     summary: Eliminar una reserva
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.delete("/:id", authenticateToken, remove);
