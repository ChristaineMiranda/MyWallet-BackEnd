import express from 'express';
import cors from 'cors';
import authRouter from './routes/AuthRoutes.js';
import movRouter from './routes/MovRoutes.js';


const server = express();
const PORT = 5000;
server.use(cors());
server.use(express.json());

server.use([authRouter,movRouter]);


server.listen(PORT, () => {
    console.log("Servidor no ar!");
});


