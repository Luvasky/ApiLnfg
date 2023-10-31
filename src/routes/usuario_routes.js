import { Router } from "express";
import { obtenerUsuarioDocumento } from "./controllers/usuario_controller.js";

const routerUsuario = Router();

routerUsuario.get(
  "/obtenerUsuarioDocumento/:documento",
  obtenerUsuarioDocumento
);

export default routerUsuario;
