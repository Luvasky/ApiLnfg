import { Router } from "express";

const routerNotificacion = Router();

routerNotificacion.post("/subscription", (req, res) => {
  const contenido = req.body;
  res.status(200).json({ message: "Subscrito" });
});

export default routerNotificacion;
