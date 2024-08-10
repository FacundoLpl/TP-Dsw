import express, { NextFunction, Request, Response } from 'express'
import { User } from './User/user.entity.js'
import { UserRepository } from './User/user.repository.js'
import { userRouter } from './User/user.routes.js'
import { shipmentTypeRepository } from './ShipmentType/shipmentType.repository.js'
import { shipmentTypeRouter } from './ShipmentType/shipmentType.routes.js'
import { categoryRouter } from './Category/category.routes.js'
import cors from 'cors'

import { scheduleRouter } from './Schedule/schedule.routes.js'



const app = express()
app.use(express.json()) 
app.use(cors())


const repository = new UserRepository()
//const repository = new shipmentTypeRepository()

app.use('/api/users', userRouter)
app.use('/api/shipmentTypes', shipmentTypeRouter)
app.use('/api/schedules', scheduleRouter)
app.use('/api/categories', categoryRouter)

app.use((req, res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})
