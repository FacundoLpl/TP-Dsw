import express from "express"
import { add, findAll, findOne, update, remove, login } from "./user.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/authMiddleware.js"

export const userRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Obtener todos los usuarios (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
userRouter.get("/", authenticateToken, isAdmin, findAll)
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Obtener un usuario por ID (admin o el mismo usuario)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.get("/:id", authenticateToken, findOne)

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [User]
 *     summary: Login de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 id:
 *                   type: string
 *                 userType:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Datos inválidos
 */
userRouter.post("/login", login)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Actualizar un usuario (admin o el mismo usuario)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.put("/:id", authenticateToken, update)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Eliminar un usuario (solo admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.delete("/:id", authenticateToken, isAdmin, remove)

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [User]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 id:
 *                   type: string
 *                 userType:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: DNI ya registrado
 */
userRouter.post("/register", add);



