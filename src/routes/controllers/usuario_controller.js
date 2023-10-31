import { pool } from "./db.js";

//Metodo para crear un trabajador

export const obtenerUsuarioDocumento = async (req, res) => {
  try {
    const respuesta = await pool.query(
      "select *from usuario where documento= ?",
      [req.params.documento]
    );

    if (respuesta[0].length === 0) {
      console.log("No se encontró ningún trabajador con ese documento.");
      res.status(404).json({ error: "No se encontró ningún trabajador" });
    } else {
      res.json(respuesta[0][0]);
    }
  } catch (error) {
    console.error("Error al buscar trabajador:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
