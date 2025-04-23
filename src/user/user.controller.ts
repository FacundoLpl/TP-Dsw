import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { User } from "./user.entity.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { validateUser } from "./user.schema.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const em = orm.em


async function findAll(req: Request,res: Response) { 
    try{
        const users = await em.find('User', {})
        res.status(200).json({message: 'finded all users', data: users})
    } catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const user = await em.findOneOrFail(User, { _id }) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found user', data: user})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }


    async function add(req: Request, res: Response) {
      try {
        // Validar los datos usando Zod
        const validationResult = validateUser(req.body);
        if (!validationResult.success) {
          return res.status(400).json({ message: validationResult.error.message });
        }
    
        // 🔐 Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
        // Crear un nuevo objeto con la contraseña encriptada
        const userData = {
          ...req.body,
          password: hashedPassword,
        };
    
        // Crear el usuario en la base de datos
        const user = em.create(User, userData);
        await em.flush();
    
        res.status(201).json({
          message: 'user created',
          data: {
            id: user.id,
            dni: user.dni,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
            address: user.address,
          }
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    }
    
async function update(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const userToUpdate = em.getReference(User,  _id )
        em.assign(userToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "User updated", data: userToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const user = em.getReference(User, _id )
        await em.removeAndFlush(user)
        res.status(200).json({ message: "User removed", data: user })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}

    async function findUserByEmail(email: string) {
        return await em.findOne(User, { email });
      }

      async function login(req: Request, res: Response){
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
          res.json({ token, userType: user.userType, id: user.id });
      
        } catch (error) {
          console.error('Error en login:', error);
          res.status(500).json({ message: 'Error interno del servidor' });
        }
      };
      

export {findAll, findOne, add, update, remove, findUserByEmail, login}