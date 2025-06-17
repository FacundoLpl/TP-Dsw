import express from "express"
import { add, findAll, findOne, update, remove, login } from "./user.controller.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/authMiddleware.js"

export const userRouter = express.Router()

// Public routes
userRouter.post("/register", add)
userRouter.post("/login", login)

// Protected routes
userRouter.get("/", authenticateToken, isAdmin, findAll)
userRouter.get("/:id", authenticateToken, findOne)
userRouter.put("/:id", authenticateToken, update)
userRouter.delete("/:id", authenticateToken, isAdmin, remove)
