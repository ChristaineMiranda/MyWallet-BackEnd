import dayjs from 'dayjs';
import db from '../config/database.js';


export async function listaMovimentacoes(req, res){
    let { token } = req.headers;
    if (!token) return res.status(401).send("Você não está autenticado");
    token = token.replace("Bearer ", "");

    try {
        const buscaToken = await db.collection("sessoes").findOne({ token});
        if (!buscaToken) return res.status(401).send("Você não está conectado");
        const movimentacao = await db.collection("movimentacoes").find({ idUsuario: buscaToken.idUsuario }).toArray();
        const conteudo = { movimentacao, nomeTitular: buscaToken.nomeUsuario };
        res.status(200).send(conteudo);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function novaMovimentacao(req, res){
    let { token } = req.headers;
    if (!token) return res.status(401).send("Você não está autenticado");
    token = token.replace("Bearer ", "");
    //vêm no body valor, descrição, tipo. Data adicinada dinamicamente
    const transacaoDados = req.body;

    if (!token) return res.status(401).send("Você não está conectado");
    
    try {
        const usuario = await db.collection("sessoes").findOne({token});
        if (!usuario) return res.status(401).send("Token inválido");
        await db.collection("movimentacoes").insertOne({
            idUsuario: usuario.idUsuario,
            tipo: transacaoDados.tipo,
            data: dayjs().format('DD/MM'),
            valor: parseFloat(transacaoDados.valor).toFixed(2),
            descricao: transacaoDados.descricao
        });
        res.status(201).send("OK");


    } catch (error) {
        res.status(500).send(error.message);
    }
}