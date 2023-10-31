import { Router } from "express";
import {
  crearPaciente,
  obtenerListaPacientes,
  obtenerPacienteDocumento,
  actualizarPaciente,
} from "./controllers/paciente_controller.js";

const routerPaciente = Router();

routerPaciente.post("/crearPaciente", crearPaciente);
routerPaciente.get("/obtenerListaPaciente", obtenerListaPacientes);
routerPaciente.get(
  "/obtenerPacienteDocumento/:documento",
  obtenerPacienteDocumento
);
routerPaciente.put("/actualizarPaciente/:documentoReq", actualizarPaciente);

export default routerPaciente;
