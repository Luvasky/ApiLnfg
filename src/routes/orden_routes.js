import { Router } from "express";
import {
  CancelarOrden,
  ImprimirOrden,
  crearOrden,
  obtenerListaOrden,
  obtenerListaOrdenTecnico,
  realizada,
  rechazada,
} from "./controllers/orden.controller.js";

const routerOrden = Router();

routerOrden.post("/crearOrden", crearOrden);
routerOrden.put("/cancelarOrden/:idOrden", CancelarOrden);
routerOrden.get("/obtenerListaOrden", obtenerListaOrden);
routerOrden.get(
  "/obtenerListaOrdenTecnico/:documento",
  obtenerListaOrdenTecnico
);
routerOrden.post("/ImprimirOrden/:documento", ImprimirOrden);
routerOrden.put("/realizada", realizada);
routerOrden.put("/rechazada", rechazada);

export default routerOrden;
