import { Router } from "express";
import { listaMovimentacoes, novaMovimentacao } from "../controllers/MovControllers.js";
import validaTransacao from "../middlewares/validaTransacao.js";

const movRouter = Router();

movRouter.get("/movimentacoes", listaMovimentacoes);
movRouter.post("/insere-movimentacao", validaTransacao, novaMovimentacao);

export default movRouter;