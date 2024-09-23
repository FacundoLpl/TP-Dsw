import { Request, Response} from "express"
import { orm } from "../shared/db/orm.js"
import { ObjectId } from "@mikro-orm/mongodb"
import { Product } from "./product.entity.js"

//const repository = new categoryRepository()
const em = orm.em // entity manager funciona como un repository de todas las clases

// el 3er parametro indicamos que relaciones queremos que cargue
async function findAll(req: Request,res: Response) { 
    try{
        const products = await em.find(Product,{}, {populate: ['category']})
        console.log(products);
        res.status(200).json({message: 'finded all products', data: products})
    } catch (error: any){
        res.status(500).json({message: error.message})
}}

async function findOne (req: Request, res: Response){
    try{
        const _id = new ObjectId(req.params.id)
        const product = await em.findOneOrFail(Product, { _id },{populate: ['category']} ) // primer parametro la clase, 2do el filtro
        res
            .status(200)
            .json({message: 'found product', data: product})
    }catch (error: any){
        res.status(500).json({message: error.message})}
    }

async function add(req: Request, res: Response) {
        try {
            const product = em.create(Product, req.body); 
    
            await em.flush();
    
            res.status(201).json({ message: 'product created', data: product });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    

async function update(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const productToUpdate = em.getReference(Product,  _id )
        em.assign(productToUpdate, req.body);
        await em.flush();
        res.status(200).json({ message: "User updated", data: productToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    }
    
async function remove(req: Request,res: Response){
    try {
        const _id = new ObjectId(req.params.id)
        const product = em.getReference(Product, _id )
        await em.removeAndFlush(product)
        res.status(200).json({ message: "User removed", data: product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }}


export { findAll, findOne, add, update, remove}