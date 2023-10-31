import { Router } from "express";
import {
  crearOrden,
  obtenerListaOrden,
} from "./controllers/orden.controller.js";

const routerOrden = Router();

routerOrden.post("/crearOrden", crearOrden);
routerOrden.get("/obtenerListaOrden", obtenerListaOrden);

export default routerOrden;
