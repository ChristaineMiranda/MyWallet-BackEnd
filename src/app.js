import express from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
server.use(cors);
server.use(express.json());
const PORT = 5002;

server.listen(PORT, () => {
    console.log("Servidor no ar!");//quando o servidor começa a ''ouvir'' nessa porta, mensagem é disparada
});

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();
    
} catch (error) {
    console.log("Houve um erro na conexão com o banco de dados", error.message);    
}
const db = mongoClient.db();


