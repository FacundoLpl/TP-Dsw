import { Request, Response, NextFunction } from "express"
import { horarioRepository } from "./horario.repository.js"
import { Horario } from "./horario.entity.js"
const repository = new horarioRepository()
//TODO Cambiar esto por la libreria zod


function sanitizehorarioInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        idHorario: req.body.idHorario,
        horaDesde: req.body.horaDesde,
        tiempoEstimado: req.body.tiempoEstimado,
        tiempoTolerancia: req.body.tiempoTolerancia,
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
    const horario = await repository.findOne({identificador:req.params.idHorario})
    if (!horario){
        return res.status(404).send({message: ' not found'})
    }
    res.json(horario)}

async function add (req: Request,res: Response) {
    const input = req.body.sanitizedInput
    const horarioInput = new Horario ( 
            input.idHorario, 
            input.horaDesde, 
            input.tiempoEstimado,
            input.tiempoTolerancia)
    
    const horario = await repository.add(horarioInput)
    return res.status(201).send({message: 'horario created', data: horario})
    }

async function update(req: Request,res: Response){
        req.body.sanitizedInput.idHorario = req.params.idHorario
        const horario= await repository.update(req.body.sanitizedInput)
        if(!horario){
            return res.status(404).send({message: ' not found'})
        } 
        return res.status(200).send({message: 'horario updated successfully.', data: horario})
    } 
    
async function remove(req: Request,res: Response){
        const identificador = req.params.idHorario
        const horario = await repository.delete({identificador})       
        if(!horario){
            res.status(404).send({message: 'horario not found.'})
        } else {
        res.status(200).send({message: 'horario deleted succesfully'})}
    }


export {sanitizehorarioInput, findAll, findOne, add, update, remove}