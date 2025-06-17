import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { validateUser } from "./user.schema.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const em = orm.em;

// Función para obtener todos los usuarios (solo Admin puede hacerlo)
async function findAll(req: Request, res: Response) { 
    try {
        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
}
        const users = await em.find(User, {});
        res.status(200).json({ message: 'Usuarios encontrados', data: users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Función para obtener un solo usuario por ID
async function findOne(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const user = await em.findOneOrFail(User, { _id });

        if (req.user.userType !== 'Admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        res.status(200).json({ message: 'Usuario encontrado', data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Función para registrar un usuario
async function add(req: Request, res: Response) {
    try {
        const validationResult = validateUser(req.body);
        if (!validationResult.success) {
          return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.error?.errors ?? [] });
        }

        const userWithSameDni = await findUserByDni(req.body.dni);
        if (userWithSameDni) {
          return res.status(409).json({ message: 'DNI ya registrado' });
        }
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };
        const user = em.create(User, userData);
        await em.flush();
    
        const token = jwt.sign(
          { id: user.id, userType: user.userType },
          process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
    
        res.status(201).json({
          message: 'Usuario registrado',
          token,
          id: user.id,
          userType: user.userType,
          expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
}

// Función para actualizar un usuario
async function update(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const userToUpdate = await em.findOneOrFail(User, { _id });

        if (req.user.userType !== 'Admin' && req.user.id !== userToUpdate.id) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        if (req.user.userType !== 'Admin' && req.body.userType) {
            return res.status(403).json({ message: 'No puedes cambiar tu tipo de usuario' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        em.assign(userToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "Usuario actualizado", data: userToUpdate });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Función para eliminar un usuario
async function remove(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const user = await em.findOneOrFail(User, { _id });

        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
        }

        await em.removeAndFlush(user);
        res.status(200).json({ message: "Usuario eliminado", data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Función para buscar un usuario por email
async function findUserByEmail(email: string) {
    return await em.findOne(User, { email });
}

// Función para buscar un usuario por DNI
async function findUserByDni(dni: string) {
    return await em.findOne(User, { dni });
}

// Función para login de usuario
async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, userType: user.userType },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            userType: user.userType,
            id: user.id,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { findAll, findOne, add, update, remove, findUserByEmail, login};
