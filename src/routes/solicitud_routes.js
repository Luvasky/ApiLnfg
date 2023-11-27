import { Router } from "express";
import {
  asignarTomada,
  borrarSolicitud,
  crearSolicitud,
  crearSolicitudWompi,
  listarSlicitudWompiRef,
  obtenerListaSolicitud,
  obtenerListaSolicitudTomada,
  obtenerListaSolicitudWompi,
  recuperarPass,
  wompiTomada,
} from "./controllers/solicitud_controller.js";

const routerSolicitud = Router();

routerSolicitud.put("/asignarTomada", asignarTomada);
routerSolicitud.post("/crearSolicitud", crearSolicitud);
routerSolicitud.post("/crearSolicitudWompi", crearSolicitudWompi);
routerSolicitud.get("/obtenerListaSolicitud", obtenerListaSolicitud);
routerSolicitud.get(
  "/obtenerListaSolicitudTomada",
  obtenerListaSolicitudTomada
);
routerSolicitud.get("/obtenerListaSolicitudWompi", obtenerListaSolicitudWompi);
routerSolicitud.delete("/borrarSolicitud/:idReq", borrarSolicitud);
routerSolicitud.get("/listarSlicitudWompiRef/:idReq", listarSlicitudWompiRef);
routerSolicitud.post("/recuperarPass", recuperarPass);
routerSolicitud.post("/wompiTomada", wompiTomada);

export default routerSolicitud;
