import 'reflect-metadata'
import { orm, syncSchema } from './shared/db/orm.js'
import cors from 'cors'
import { RequestContext } from '@mikro-orm/core'
import express, { NextFunction, Request, Response } from 'express'
import { userRouter } from './User/user.routes.js'
import { shipmentTypeRouter } from './ShipmentType/shipmentType.routes.js'
import { categoryRouter } from './Category/category.routes.js'
import { scheduleRouter } from './Schedule/schedule.routes.js'
import { productRouter } from './Product/product.routes.js'
import { cartRouter } from './Cart/cart.routes.js'


const app = express()
app.use(express.json()) 
app.use(cors())

//Agrego un middleware, luego de express, antes de las rutas.
app.use((req, res, next) => {
    RequestContext.create(orm.em, next) // entity manager (abstraccion que permite manejar todas las entidades de forma uniforme y desde un unico punto)
})
await syncSchema() // sincroniza la base de datos con el modelo de datos

app.use('/api/users', userRouter)
app.use('/api/shipmentTypes', shipmentTypeRouter)
app.use('/api/schedules', scheduleRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use((req, res)=>{res.status(404).send({message:'Resource not found'})})

app.listen(3000, () => {console.log('server running on http://localhost:3000')})

