import { Router } from "express";
import {
  actualizarSede,
  crearSede,
  obtenerListaSede,
  obtenerSede,
} from "./controllers/sede_controller.js";

const routerSede = Router();

routerSede.post("/crearSede", crearSede);
routerSede.get("/obtenetListaSede", obtenerListaSede);
routerSede.put("/actualizarSede/:idSede", actualizarSede);
routerSede.get("/obtenerSede/:idSede", obtenerSede);

export default routerSede;
