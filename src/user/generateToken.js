import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();  // Esto carga las variables de entorno

console.log("JWT_SECRET:", process.env.JWT_SECRET); // para debug

const payload = {
  id: "testuserid",
  userType: "Admin",
};

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
});

console.log("Token generado:", token);
