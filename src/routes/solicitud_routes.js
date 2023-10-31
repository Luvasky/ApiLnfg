import { Router } from "express";
import {
  crearSolicitud,
  obtenerListaSolicitud,
} from "./controllers/solicitud_controller.js";

const routerSolicitud = Router();

routerSolicitud.post("/crearSolicitud", crearSolicitud);
routerSolicitud.get("/obtenerListaSolicitud", obtenerListaSolicitud);

export default routerSolicitud;
