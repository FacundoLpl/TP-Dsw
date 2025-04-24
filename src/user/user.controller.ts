import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { validateUser } from "./user.schema.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const em = orm.em;

async function findAll(req: Request, res: Response) { 
    try {
        // Solo Admin puede listar todos los usuarios
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
        }

        const users = await em.find(User, {});
        res.status(200).json({ message: 'Usuarios encontrados', data: users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const user = await em.findOneOrFail(User, { _id });

        // Admin puede ver cualquier usuario, otros solo pueden verse a sí mismos
        if (req.user.role !== 'Admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        res.status(200).json({ message: 'Usuario encontrado', data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        // Solo Admin puede crear nuevos usuarios
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
        }

        const validationResult = validateUser(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword,
        };

        const user = em.create(User, userData);
        await em.flush();

        res.status(201).json({
            message: 'Usuario creado',
            data: {
                id: user.id,
                dni: user.dni,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.userType, // Ahora usamos role en lugar de userType
                address: user.address,
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const userToUpdate = await em.findOneOrFail(User, { _id });

        // Admin puede modificar cualquier usuario, otros solo pueden modificarse a sí mismos
        if (req.user.role !== 'Admin' && req.user.id !== userToUpdate.id) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        // Usuarios no-admin no pueden cambiar su rol
        if (req.user.role !== 'Admin' && req.body.userType && req.body.userType !== userToUpdate.userType) {
            return res.status(403).json({ message: 'No puedes cambiar tu tipo de usuario' });
        }

        // Si se está actualizando la contraseña, encriptarla
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

async function remove(req: Request, res: Response) {
    try {
        const _id = new ObjectId(req.params.id);
        const user = await em.findOneOrFail(User, { _id });

        // Solo Admin puede eliminar usuarios
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
        }

        await em.removeAndFlush(user);
        res.status(200).json({ message: "Usuario eliminado", data: user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findUserByEmail(email: string) {
    return await em.findOne(User, { email });
}

async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validación básica
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

        // Generar token con role (userType)
        const token = jwt.sign(
            {
                id: user.id,
                role: user.userType, // Usamos role en lugar de userType
            },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            role: user.userType, // Mantenemos userType en la respuesta por compatibilidad
            id: user.id,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { findAll, findOne, add, update, remove, findUserByEmail, login };