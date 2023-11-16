import { Router } from "express";
import {
  borrarSolicitud,
  crearSolicitud,
  crearSolicitudWompi,
  listarSlicitudWompiRef,
  obtenerListaSolicitud,
  obtenerListaSolicitudWompi,
  recuperarPass,
} from "./controllers/solicitud_controller.js";

const routerSolicitud = Router();

routerSolicitud.post("/crearSolicitud", crearSolicitud);
routerSolicitud.post("/crearSolicitudWompi", crearSolicitudWompi);
routerSolicitud.get("/obtenerListaSolicitud", obtenerListaSolicitud);
routerSolicitud.get("/obtenerListaSolicitudWompi", obtenerListaSolicitudWompi);
routerSolicitud.delete("/borrarSolicitud/:idReq", borrarSolicitud);
routerSolicitud.get("/listarSlicitudWompiRef/:idReq", listarSlicitudWompiRef);
routerSolicitud.post("/recuperarPass", recuperarPass);

export default routerSolicitud;
