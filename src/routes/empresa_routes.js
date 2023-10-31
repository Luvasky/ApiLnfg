import { Router } from "express";
import {
  crearEmpresa,
  obtenerListaEmpresas,
} from "./controllers/empresa_controller.js";

const routerEmpresa = Router();

routerEmpresa.get("/obtenerListaEmpresas", obtenerListaEmpresas);
routerEmpresa.post("/crearEmpresa", crearEmpresa);

export default routerEmpresa;
