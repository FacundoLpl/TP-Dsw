import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./schedule.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const scheduleRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Endpoints para horarios disponibles
 */

/**
 * @swagger
 * /schedules:
 *   get:
 *     tags: [Schedule]
 *     summary: Obtener todos los horarios
 *     responses:
 *       200:
 *         description: Lista de horarios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.get("/", findAll);

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     tags: [Schedule]
 *     summary: Obtener un horario por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del horario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Horario no encontrado
 */
scheduleRouter.get("/:id", findOne);

/**
 * @swagger
 * /schedules:
 *   post:
 *     tags: [Schedule]
 *     summary: Crear un nuevo horario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Horario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Error en la petición
 */
scheduleRouter.post("/", authenticateToken, isAdmin, add);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     tags: [Schedule]
 *     summary: Actualizar un horario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del horario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Horario actualizado
 *       404:
 *         description: Horario no encontrado
 */
scheduleRouter.put("/:id", authenticateToken, isAdmin, update);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     tags: [Schedule]
 *     summary: Eliminar un horario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del horario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horario eliminado
 *       404:
 *         description: Horario no encontrado
 */
scheduleRouter.delete("/:id", authenticateToken, isAdmin, remove);
