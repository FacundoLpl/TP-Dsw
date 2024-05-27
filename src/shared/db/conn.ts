import { MongoClient, Db} from "mongodb";
import config from 'dotenv'
config.config()

const connectionStr = process.env.MONGO_URI || 'mongodb://localhost:27017'
console.log(connectionStr) 
const cli = new MongoClient(connectionStr)
await cli.connect()

export let db: Db = cli.db('TrabajoDSW')