import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();

} catch (error) {
    console.log("Houve um erro na conexão com o banco de dados", error.message);
}
const db = mongoClient.db();

export default db;