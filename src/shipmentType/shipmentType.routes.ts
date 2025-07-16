import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./shipmentType.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const shipmentTypeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: ShipmentType
 *   description: Endpoints para tipos de envío
 */

/**
 * @swagger
 * /shipmentTypes:
 *   get:
 *     tags: [ShipmentType]
 *     summary: Obtener todos los tipos de envío
 *     responses:
 *       200:
 *         description: Lista de tipos de envío
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShipmentType'
 */
shipmentTypeRouter.get("/", findAll);

/**
 * @swagger
 * /shipmentTypes/{id}:
 *   get:
 *     tags: [ShipmentType]
 *     summary: Obtener un tipo de envío por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del tipo de envío
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de envío encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentType'
 *       404:
 *         description: Tipo de envío no encontrado
 */
shipmentTypeRouter.get("/:id", findOne);

/**
 * @swagger
 * /shipmentTypes:
 *   post:
 *     tags: [ShipmentType]
 *     summary: Crear un nuevo tipo de envío
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipmentType'
 *     responses:
 *       201:
 *         description: Tipo de envío creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentType'
 *       400:
 *         description: Error en la petición
 */
shipmentTypeRouter.post("/", authenticateToken, isAdmin, add);

/**
 * @swagger
 * /shipmentTypes/{id}:
 *   put:
 *     tags: [ShipmentType]
 *     summary: Actualizar un tipo de envío
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del tipo de envío a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipmentType'
 *     responses:
 *       200:
 *         description: Tipo de envío actualizado
 *       404:
 *         description: Tipo de envío no encontrado
 */
shipmentTypeRouter.put("/:id", authenticateToken, isAdmin, update);

/**
 * @swagger
 * /shipmentTypes/{id}:
 *   delete:
 *     tags: [ShipmentType]
 *     summary: Eliminar un tipo de envío
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del tipo de envío a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de envío eliminado
 *       404:
 *         description: Tipo de envío no encontrado
 */
shipmentTypeRouter.delete("/:id", authenticateToken, isAdmin, remove);
