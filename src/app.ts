import express, { NextFunction, Request, Response } from 'express'
import { User } from './user.js'
const app = express()

// CRUD anotaciones
//nos comunicamos entre front y back con api rest. 
//GET -> obtener info sobre recursos. Post--> crear nuevos recursos. 
//Delete --> borrar recursos. Put/Patch --> modificar recursos
//character(clase de ejemplo) --> /api/v1/characters
//get /api/v1/characters --> obtener la lista de characters
//get /api/v1/characters/:id --> obtener uno en especifico
//post /api/v1/characters --> crear nuevos 
//delete /api/v1/characters/:id --> borra character especifico
// put o patch /api/v1/characters/:id --> update character con id=id
//user --> request --> express --> express.json (middleware)--> app.post (req.body)--> response --> user

// middleware que se usa en post, put y patch
app.use(express.json()) 

const users: User[] = [
    new User(
        '43349481',
        'Facundo',
        'Cantaberta',
        'Admin'
    )
]
//Function sanitize input
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

//READ
app.get('/api/users', (req,res)=>{ //Muestro todos los usuarios
    res.json(users)
})

app.get('/api/users/:dni', (req,res)=>{ //muestro un usuario buscando por DNI
    const user = users.find((user) => user.dni === req.params.dni)
    if (!user){
        return res.status(404).send({message: 'character not found'})
    }
    res.json(user)
})

//CREATE
app.post('/api/users', sanitizeUserInput,(req,res) => {
    const input = req.body.sanitizedInput
    const user = new User ( 
        input.dni, 
        input.firstName, 
        input.lastName, 
        input.userType)

    users.push(user)
    return res.status(201).send({message: 'User created', data: user})
})

//UPDATE
app.put('/api/users/:dni', sanitizeUserInput, (req, res) =>{
    const userIdx = users.findIndex((user) => user.dni === req.params.dni)
    if(userIdx === -1){
        return res.status(404).send({message: 'character not found'})
    } 
    
    Object.assign(users[userIdx], req.body.sanitizedInput) //llamo a la funcion Sanitize Input
    return res.status(200).send({message: 'user updated successfully.', data: users[userIdx]})
}) //uso el index para modificar el user y no crear uno nuevo

app.patch('/api/users/:dni', sanitizeUserInput, (req, res) => {
    const userIdx = users.findIndex((user) => user.dni === req.params.dni)
    if(userIdx === -1){
        return res.status(404).send({message: 'character not found'})
    } 
    
    Object.assign(users[userIdx], req.body.sanitizedInput) //llamo a la funcion Sanitize Input
    return res.status(200).send({message: 'user updated successfully.', data: users[userIdx]})
}) //uso el index para modificar el user y no crear uno nuevo


//DELETE
app.delete('/api/users/:dni', (req,res)=>{
    const userIdx = users.findIndex((user) => user.dni === req.params.dni)
    
    if(userIdx === -1){
        res.status(404).send({message: 'User not found.'})
    } else {
    users.splice(userIdx, 1)
    res.status(200).send({message: 'User deleted succesfully'})}
})

app.use((req, res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})