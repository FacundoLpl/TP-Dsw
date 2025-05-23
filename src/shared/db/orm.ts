import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import config from "dotenv"

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
    type:"mongo",
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
}