import { Router } from "express";
import {
  crearPaciente,
  obtenerListaPacientes,
  obtenerPacienteDocumento,
  actualizarPaciente,
  actualizarDireccion,
} from "./controllers/paciente_controller.js";

const routerPaciente = Router();

routerPaciente.post("/crearPaciente", crearPaciente);
routerPaciente.get("/obtenerListaPaciente", obtenerListaPacientes);
routerPaciente.get(
  "/obtenerPacienteDocumento/:documento",
  obtenerPacienteDocumento
);
routerPaciente.put("/actualizarPaciente/:documentoReq", actualizarPaciente);
routerPaciente.put("/actualizarDireccion/:documento", actualizarDireccion);

export default routerPaciente;
