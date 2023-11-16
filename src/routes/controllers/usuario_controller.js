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

export const olvido = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const { documento, correo } = req.body;

    try {
      const respuesta = await connection.query(
        "select * from persona where documento = ?",
        [documento]
      );

      if (respuesta[0][0].email == correo) {
        // res.status(200).json({ respuesa: "USUSARIO ENCONTRADO" });

        const response = await connection.query(
          "select * from usuario where documento = ?",
          [documento]
        );
        res.status(200).json({ respuesta: response[0][0].contrasena });
      } else {
        res.status(404).json({ respuesta: "USUSARIO NO ENCONTRADO" });
      }

      connection.commit();
    } catch (error) {
      // Manejar el error de consulta SQL aquí.
      res.status(500).json({ error: "Error en la consulta SQL" });
      connection.rollback();
    }
  } catch (error) {
    // Manejar el error de conexión a la base de datos aquí.
    res.status(500).json({ error: "Error al conectarse a la base de datos" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const cambiarPass = async (req, res) => {
  let connection;

  const { contrasena } = req.body;
  const { documento } = req.params;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const respuesta = await connection.query(
      `update usuario
        set contrasena =?
        where documento =?`,
      [contrasena, documento]
    );

    res.status(200).json(respuesta);
    connection.commit();
  } catch (error) {
    // Manejar el error de consulta SQL aquí.
    res.status(500).json({ error: "Error en la consulta SQL" });
    connection.rollback();
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
