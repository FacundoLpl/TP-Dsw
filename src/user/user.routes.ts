import express from "express";
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  login,
} from "./user.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

export const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para gestión de usuarios
 */

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
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en la solicitud
 */
userRouter.post("/register", add);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [User]
 *     summary: Iniciar sesión con email y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas
 */
userRouter.post("/login", login);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Obtener todos los usuarios (admin)
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
 *                 $ref: '#/components/schemas/UserResponse'
 */
userRouter.get("/", authenticateToken, isAdmin, findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Obtener usuario por ID
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
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.get("/:id", authenticateToken, findOne);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Actualizar un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario a actualizar
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
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.put("/:id", authenticateToken, update);

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
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.delete("/:id", authenticateToken, isAdmin, remove);
