import { Request, Response, NextFunction } from "express"
import { categoryRepository } from "./category.repository.js"
import { Category } from "./category.entity.js"
const repository = new categoryRepository()

function sanitizecategoryInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        catId: req.body.catId,
        name: req.body.name,
    }

    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key] === undefined) 
            delete req.body.sanitizedInput[key]
    })
    next()
}


async function findAll(req: Request,res: Response) { 
    res.json({data: await repository.findAll()})
}

async function findOne (req: Request, res: Response){
    const category = await repository.findOne({identificador:req.params.catId})
    if (!category){
        return res.status(404).send({message: ' not found'})
    }
    res.json(category)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const categoryInput = new Category ( 
            input.catId,
            input.name, 
          )
    
    const category = await repository.add(categoryInput)
    return res.status(201).send({message: 'category created', data: category})
    }

async function update(req: Request,res: Response){
    req.body.sanitizedInput.catId = req.params.catId
    const category= await repository.update(req.body.sanitizedInput)
    if(!category){
        return res.status(404).send({message: ' not found'})
     } 
    return res.status(200).send({message: 'category successfully.', data: category})
    } 
    
async function remove(req: Request,res: Response){
        const identificador = req.params.catId
        const category = await repository.delete({identificador})       
        if(!category){
            res.status(404).send({message: 'category not found.'})
        } else {
        res.status(200).send({message: 'category deleted succesfully'})}
    }


export {sanitizecategoryInput, findAll, findOne, add, update, remove}