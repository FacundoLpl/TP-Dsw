import { Request, Response, NextFunction } from "express"
import { categoriaRepository } from "./categoria.repository.js"
import { Categoria } from "./categoria.entity.js"
const repository = new categoriaRepository()

function sanitizecategoriaInput(req: Request, res: Response, next:NextFunction){
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
    const categoria = await repository.findOne({identificador:req.params.catId})
    if (!categoria){
        return res.status(404).send({message: ' not found'})
    }
    res.json(categoria)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const categoriaInput = new Categoria ( 
            input.catId,
            input.name, 
          )
    
    const categoria = await repository.add(categoriaInput)
    return res.status(201).send({message: 'categoria created', data: categoria})
    }

async function update(req: Request,res: Response){
    req.body.sanitizedInput.catId = req.params.catId
    const categoria= await repository.update(req.body.sanitizedInput)
    if(!categoria){
        return res.status(404).send({message: ' not found'})
     } 
    return res.status(200).send({message: 'categoria successfully.', data: categoria})
    } 
    
async function remove(req: Request,res: Response){
        const identificador = req.params.catId
        const categoria = await repository.delete({identificador})       
        if(!categoria){
            res.status(404).send({message: 'categoria not found.'})
        } else {
        res.status(200).send({message: 'categoria deleted succesfully'})}
    }


export {sanitizecategoriaInput, findAll, findOne, add, update, remove}