import { Router } from "express";
import {
  actualizarPaquete,
  crearPaquete,
  obtenerListaPaquete,
  obtenerListaPaqueteSinNO,
  obtenerPqueteId,
  sumarPrecioPaquetes,
} from "./controllers/paquete_controller.js";

const routerPaquete = Router();

routerPaquete.post("/crearPaquete", crearPaquete);
routerPaquete.get("/obtenerListaPaquete", obtenerListaPaquete);
routerPaquete.get("/obtenerListaPaqueteSinNo", obtenerListaPaqueteSinNO);
routerPaquete.put("/actualizarPaquete/:idReq", actualizarPaquete);
routerPaquete.get("/obtenerPaqueteId/:idReq", obtenerPqueteId);
routerPaquete.post("/sumarPrecioPaquetes", sumarPrecioPaquetes);

export default routerPaquete;
