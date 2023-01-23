import bcrypt, { compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../config/database.js';


export async function signUp(req, res){
    const cadastroDados = req.body;
 
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
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function login(req, res){
    const loginDados = req.body;
    
    try {
        const usuario = await db.collection("usuarios").findOne({ emailUsuario: loginDados.email });
        if (!usuario) return res.status(409).send("Usuário não cadastrado");

        if (compareSync(loginDados.senha, usuario.senhaUsuario)) {
            const token = uuid();
            await db.collection("sessoes").insertOne({ idUsuario: usuario._id, nomeUsuario: usuario.nomeUsuario, token });
            return res.status(200).send(token);
        }
        res.status(401).send("Usuário ou senha inválido");
    } catch (error) {
        res.status(500).send(error.message);
    }
}