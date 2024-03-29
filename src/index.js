import express from "express";
import router from "./routes/trabajador_routes.js";
import routerUsuario from "./routes/usuario_routes.js";
import routerPaciente from "./routes/paciente_routes.js";
import routerExamen from "./routes/examen_routes.js";
import routerSede from "./routes/sede_routes.js";
import cors from "cors";
import routerPaquete from "./routes/paquete_routes.js";
import routerOrden from "./routes/orden_routes.js";
import routerEmpresa from "./routes/empresa_routes.js";
import routerSolicitud from "./routes/solicitud_routes.js";
import routerNotificacion from "./routes/notificacion_routes.js";
import { PORT } from "./config.js";
import webpush from "./web_push.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/apiLNFG", router);
app.use("/apiLNFG", routerPaciente);
app.use("/apiLNFG", routerUsuario);
app.use("/apiLNFG", routerExamen);
app.use("/apiLNFG", routerSede);
app.use("/apiLNFG", routerPaquete);
app.use("/apiLNFG", routerOrden);
app.use("/apiLNFG", routerEmpresa);
app.use("/apiLNFG", routerSolicitud);
app.use("/apiLNFG", routerNotificacion);

app.listen(PORT);
console.log("Server on port 3000");
