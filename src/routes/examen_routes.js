import { Router } from "express";
import {
  crearExamen,
  actualizarExamen,
  obetenerListaExamenes,
  obtenerExamenId,
  enviarDato,
  sumarPrecioExamenes,
  obetenerListaExamenesSinNo,
} from "./controllers/examen_controller.js";

const routerExamen = Router();

routerExamen.post("/crearExamen", crearExamen);
routerExamen.put("/actualizarExamen/:idExamenConsulta", actualizarExamen);
routerExamen.get("/obtenerListaExamenes", obetenerListaExamenes);
routerExamen.get("/obetenerListaExamenesSinNo", obetenerListaExamenesSinNo);
routerExamen.get("/obtenerExameneId/:id", obtenerExamenId);
routerExamen.post("/envioDato", enviarDato);
routerExamen.post("/sumarPrecioExamenes", sumarPrecioExamenes);

export default routerExamen;
