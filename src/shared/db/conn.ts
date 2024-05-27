import { MongoClient, Db} from "mongodb";

const connectionStr = process.env.MONGO_URI || 'mongodb+srv://mariapaz:TrabajoDSW@restaurant.xreyzj3.mongodb.net/'

const cli = new MongoClient(connectionStr)
await cli.connect()

export let db: Db = cli.db('TrabajoDSW')