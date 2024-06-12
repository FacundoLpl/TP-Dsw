import { Request, Response, NextFunction } from "express"
import { UserRepository } from "./User.repository.js"
import { User } from "./user.entity.js"
const repository = new UserRepository()
//TODO Cambiar esto por la libreria zod
function sanitizeUserInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        dni: req.body.dni,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: req.body.userType,
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
    const user = await repository.findOne({identificador:req.params.dni})
    if (!user){
        return res.status(404).send({message: 'character not found'})
    }
    res.json(user)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const userInput = new User ( 
            input.dni, 
            input.firstName, 
            input.lastName, 
            input.userType)
    
    const user = await repository.add(userInput)
    return res.status(201).send({message: 'User created', data: user})
    }

async function update(req: Request,res: Response){
        req.body.sanitizedInput.dni = req.params.dni
        const user= await repository.update(req.body.sanitizedInput)
        if(!user){
            return res.status(404).send({message: 'character not found'})
        } 
        return res.status(200).send({message: 'user updated successfully.', data: user})
    } 
    
async function remove(req: Request,res: Response){
        const identificador=req.params.dni
        const user = await repository.delete({identificador})       
        if(!user){
            res.status(404).send({message: 'User not found.'})
        } else {
        res.status(200).send({message: 'User deleted succesfully'})}
    }


export {sanitizeUserInput, findAll, findOne, add, update, remove}