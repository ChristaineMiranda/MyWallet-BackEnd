import joi from "joi";
import validaDados from './validaDados.js';

const cadastroSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required(),
    confirmaSenha: joi.valid(joi.ref('senha')).required()
});

export default function validaCadastro(req, res, next){
    const cadastroDados = req.body;
    const erroCadastro = validaDados(cadastroSchema, cadastroDados);
    if (erroCadastro) return res.status(422).send(erroCadastro);
    
    next();
}