import express, { NextFunction, Request, Response } from 'express'
import { User } from './user/user.entity.js'
import { UserRepository } from './user/User.repository.js'
import { userRouter } from './user/user.routes.js'
import { shipmentTypeRepository } from './shipmentType/shipmentType.repository.js'
import { shipmentTypeRouter } from './shipmentType/shipmentType.routes.js'
import { categoriaRouter } from './Categoria/categoria.routes.js'
import cors from 'cors'

import { horarioRouter } from './horario/horario.routes.js'



const app = express()
app.use(express.json()) 
app.use(cors())


const repository = new UserRepository()
//const repository = new shipmentTypeRepository()

app.use('/api/users', userRouter)
app.use('/api/shipmentTypes', shipmentTypeRouter)
app.use('/api/horarios', horarioRouter)
app.use('/api/categorias', categoriaRouter)

app.use((req, res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})
