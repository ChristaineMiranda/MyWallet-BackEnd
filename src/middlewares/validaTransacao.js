import joi from 'joi';
import validaDados from './validaDados.js';

const transacaoSchema = joi.object({
    tipo: joi.string().valid("entrada", "saida").required(),
    valor: joi.number().precision(2).required(),
    descricao: joi.string().max(50).required(),
});

export default function validaTransacao(req, res, next) {
    const transacaoDados = req.body;
    const erroTransacao = validaDados(transacaoSchema, transacaoDados);
    if (erroTransacao) return res.status(422).send("Verifique o preenchimento dos campos");
    
    next();
}

