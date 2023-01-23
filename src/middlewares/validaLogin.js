import joi from "joi";
import validaDados from './validaDados.js';


const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required()
});

export default function validaLogin(req, res, next){
    const loginDados = req.body;
    const erroLogin = validaDados(loginSchema, loginDados);
    if (erroLogin) return res.status(422).send("Preencha corretamente os campos");
   
    next();
}