import { Router } from "express";
import {findAll, findOne, add, update, remove, findUserByEmail} from "./user.controller.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.post('/', add)
userRouter.put('/:id', update)
userRouter.delete('/:id', remove)

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Buscar usuario por email
      const user = await findUserByEmail(email); // esta función la armamos abajo
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      // 2. Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });
  
      // 3. Generar token JWT
      const token = jwt.sign(
        { id: user.id, userType: user.userType },
        process.env.JWT_SECRET || 'clave-secreta',
        { expiresIn: '1h' }
      );
  
      // 4. Devolver token y tipo de usuario
      res.json({ token, userType: user.userType });
  
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  
