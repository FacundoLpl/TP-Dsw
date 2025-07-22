import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import config from "dotenv"
import { MongoDriver } from '@mikro-orm/mongodb';
import { Order } from '../../Order/order.entity.js';
import { Reservation } from "../../Reservation/reservation.entity.js";
import { Cart } from "../../Cart/cart.entity.js";
import { User } from "../../User/user.entity.js";
import { Category } from "../../Category/category.entity.js";
import { ShipmentType } from "../../ShipmentType/shipmentType.entity.js";
import { Schedule } from "../../Schedule/schedule.entity.js";


config.config()
const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant';
const MONGO_DB = process.env.MONGO_DB;

export const orm = await MikroORM.init({
   entities: ["dist/**/*.entity.js"],
entitiesTs: ["src/**/*.entity.ts"],
    dbName: MONGO_DB,
    clientUrl: connectionString,
    highlighter: new MongoHighlighter(),
    debug: true,
    allowGlobalContext: true,
    driver: MongoDriver,
    type:"mongo",
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}
