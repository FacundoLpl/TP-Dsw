import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export interface AuthenticatedRequest extends Request {
 user: {
    id: string
    userType: string
  }
}
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" })
  }
  try {
    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !("userType" in decoded)) {
      return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token format" })
    }

    req.user = {
      id: (decoded as any).id,
      userType: (decoded as any).userType,
    }

    next()
  } catch (err) {
    if (err && typeof err === "object" && "name" in err && (err as any).name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Token has expired" })
    }

    return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token" })
  }
}

export const roleMiddleware = (roles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" })
    }

    const userRole = req.user.userType

    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({ code: "FORBIDDEN", message: "Access denied: insufficient permissions" })
    }

    next()
  }
}

export const isAdmin = roleMiddleware(["Admin"])
