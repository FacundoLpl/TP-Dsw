import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./category.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

export const categoryRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints para categorías de productos
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Category]
 *     summary: Obtener todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRouter.get("/", findAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Category]
 *     summary: Obtener categoría por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.get("/:id", findOne);

// Middleware de autenticación para las rutas protegidas
categoryRouter.use(authenticateToken);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Category]
 *     summary: Crear una nueva categoría
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error en la petición
 */
categoryRouter.post("/", add);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Category]
 *     summary: Actualizar una categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.put("/:id", update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Category]
 *     summary: Eliminar una categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
categoryRouter.delete("/:id", remove);
