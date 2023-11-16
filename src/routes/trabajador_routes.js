import { Router } from "express";
import {
  crearTrabajador,
  obtenerTrabajadores,
  obtenerTrabajadorDocumento,
  actualizarTrabajador,
  obtenerTecnicos,
  inhabilitar,
  habilitar,
} from "./controllers/trabajador_controller.js";

const router = Router();

router.get("/obtenerTrabajadores", obtenerTrabajadores);
router.post("/crearTrabajador", crearTrabajador);
router.get(
  "/obtenerTrabajadorDocumento/:documento",
  obtenerTrabajadorDocumento
);
router.put("/actualizarTrabajador/:documentoReq", actualizarTrabajador);
router.get("/obtenerTecnico", obtenerTecnicos);
router.put("/inhabilitar", inhabilitar);
router.put("/habilitar", habilitar);

export default router;
