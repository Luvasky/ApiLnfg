import { Router } from "express";
import {
  cambiarPass,
  obtenerUsuarioDocumento,
  olvido,
} from "./controllers/usuario_controller.js";

const routerUsuario = Router();

routerUsuario.get(
  "/obtenerUsuarioDocumento/:documento",
  obtenerUsuarioDocumento
);

routerUsuario.post("/olvido", olvido);
routerUsuario.put("/cambiarPass/:documento", cambiarPass);

export default routerUsuario;
