import { Request, Response} from "express"
import { Category } from "./category.entity.js"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"

const em = orm.em



async function findAll(req: Request,res: Response) { 
    try{
        const categories = await em.find('Category', {})
        res.status(200).json({message: 'found all categories', data: categories})
    } catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const category = await em.findOneOrFail(Category, { _id }) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found category', data: category})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add (req: Request,res: Response) {
    try{
        const category = em.create(Category, req.body)
        await em.flush()
        res
            .status(201)
            .json({message: 'Category created', data: category})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }}

    async function update(req: Request,res: Response){
        try {
            const _id = new ObjectId(req.params.id)
            const categoryToUpdate = em.getReference(Category,  _id )
            em.assign(categoryToUpdate, req.body);
            await em.flush();
            res.status(200).json({ message: "Category updated", data: categoryToUpdate })
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
        }

    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const category = em.getReference(Category, _id )
        await em.removeAndFlush(category)
        res.status(200).json({ message: "Category removed", data: category })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}



export {findAll, findOne, add, update, remove}
