import { Router } from "express";
import { signUp, login } from "../controllers/AuthControllers.js";
import validaCadastro from "../middlewares/validaCadastro.js";
import validaLogin from "../middlewares/validaLogin.js";

const authRouter = Router();

authRouter.post("/sign-up", validaCadastro,signUp);
authRouter.post("/", validaLogin, login);

export default authRouter;