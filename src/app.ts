import "reflect-metadata" ;
import { orm, syncSchema } from "./shared/db/orm.js"
import cors from "cors"
import { RequestContext } from "@mikro-orm/core"
import express from "express"
import { userRouter } from "./User/user.routes.js"
import { shipmentTypeRouter } from "./ShipmentType/shipmentType.routes.js"
import { categoryRouter } from "./Category/category.routes.js"
import { scheduleRouter } from "./Schedule/schedule.routes.js"
import { productRouter } from "./Product/product.routes.js"
import { cartRouter } from "./Cart/cart.routes.js"
import { orderRouter } from "./Order/order.routes.js"
import { reservationRouter } from "./Reservation/reservation.routes.js"
import { authenticateToken } from "./middlewares/authMiddleware.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./shared/db/swagger.js";

export const app = express()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
await syncSchema()
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas públicas 
app.use("/api/users/login", userRouter)
app.use("/api/users/register", userRouter)
app.use("/api/products", productRouter)

// Rutas protegidas 
app.use("/api/users", userRouter) 
app.use("/api/shipmentTypes", authenticateToken, shipmentTypeRouter)
app.use("/api/schedules", authenticateToken, scheduleRouter)
app.use("/api/categories", authenticateToken, categoryRouter)
app.use("/api/carts", authenticateToken, cartRouter)
app.use("/api/orders", authenticateToken, orderRouter)
app.use("/api/reservations", authenticateToken, reservationRouter)

app.use((req, res) => {
  res.status(404).send({ message: "Resource not found" })
})

app.listen(3000, () => {
  console.log("server running on http://localhost:3000")
})
