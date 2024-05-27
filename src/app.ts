import express, { NextFunction, Request, Response } from 'express'
import { User } from './user/user.entity.js'
import { UserRepository } from './user/User.repository.js'
import { userRouter } from './user/user.routes.js'

const app = express()
app.use(express.json()) 


const repository = new UserRepository()

app.use('/api/users', userRouter)

app.use((req, res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})
