import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { User } from "./user.entity.js"
import { ObjectId } from "@mikro-orm/mongodb"


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

async function add (req: Request,res: Response) {
    try{
        const user = em.create(User, req.body)
        await em.flush()
        res
            .status(201)
            .json({message: 'user created', data: user})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}

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


export {findAll, findOne, add, update, remove}