import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt, { compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';


dotenv.config();

//schemas de validação de dados

const cadastroSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required(),
    confirmaSenha: joi.valid(joi.ref('senha')).required()
});
const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required()
});
const trasacaoSchema = joi.object({
    valor: joi.string().required(),
    descricao: joi.string().required()
});
//função de validação de dados
function validaDados(schema, dados) {

    const validation = schema.validate(dados, { abortEarly: false });
    if (validation.error) {
        const erros = validation.error.details.map((detail) => (detail.message));
        return erros
    }
}

const server = express();
server.use(cors());
server.use(express.json());
const PORT = 5000;

server.listen(PORT, () => {
    console.log("Servidor no ar!");
});

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();

} catch (error) {
    console.log("Houve um erro na conexão com o banco de dados", error.message);
}
const db = mongoClient.db();



server.post("/sign-up", async (req, res) => {
    const cadastroDados = req.body;
    const erroCadastro = validaDados(cadastroSchema, cadastroDados);
    if (erroCadastro) return res.status(422).send("Verifique o preenchimento dos campos");

    try {
        const buscaUsuario = await db.collection("usuarios").findOne({ emailUsuario: cadastroDados.email });
        if (buscaUsuario) return res.status(409).send("Esse email já está sendo usado");

        const senhaHash = bcrypt.hashSync(cadastroDados.senha, 10);

        await db.collection("usuarios").insertOne({
            nomeUsuario: cadastroDados.nome,
            emailUsuario: cadastroDados.email,
            senhaUsuario: senhaHash
        });
        res.status(201).send("Usuário cadastrado com sucesso!");
    } catch (erro) {
        res.status(500).send(erro.message);
    }
});

server.post("/", async (req, res) => {
    const loginDados = req.body;
    const erroLogin = validaDados(loginSchema, loginDados);
    if (erroLogin) return res.status(422).send("Preencha corretamente os campos");

    try {
        const usuario = await db.collection("usuarios").findOne({ emailUsuario: loginDados.email });
        if (!usuario) return res.status(401).send("Usuário não cadastrado");
      
        if (compareSync(loginDados.senha, usuario.senhaUsuario)) {
            const token = uuid();
            await db.collection("sessoes").insertOne({idUsuario: usuario._id, token});
            return res.status(200).send("Sessão criada");
        }
        res.status(401).send("Usuário ou senha inválido");
        
    } catch (erro) {
        res.status(500).send(erro.message);
    }



})




