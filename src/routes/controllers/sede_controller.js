import { pool } from "./db.js";

export const crearSede = async (req, res) => {
  const { nombre_sede, direccion, telefono } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO sede(nombre_sede, direccion, telefono) VALUES (?, ?, ?)",
      [nombre_sede, direccion, telefono]
    );

    await connection.commit();
    res.status(200).json({ respuesta: "Sede creada exitosamente" });
  } catch (error) {
    if (connection) {
      // Si hay un error, usa el pool para realizar el rollback
      await connection.rollback();
    }
    res
      .status(500)
      .json({ message: "OCURRIO UN ERROR AL CREAR UNA SEDE", error: error });
  } finally {
    if (connection) {
      // Siempre usa el pool para liberar la conexión
      await connection.release();
    }
  }
};

export const obtenerListaSede = async (req, res) => {
  const connection = await pool.getConnection();
  connection.beginTransaction();

  try {
    const resultado = await connection.query("select * from sede");

    await connection.commit();
    res.status(200).json({ respuesta: resultado[0] });
  } catch (error) {
    await connection.rollback();
    console.log(error); // Agregar esta línea para ver detalles del error en la consola
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LOS EXAMENES",
      error: error,
    });
  } finally {
    connection.release();
  }
};

export const obtenerSede = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const { idSede } = req.params;

    try {
      const respuestaLuva = await connection.query(
        "select * from Sede where id_sede = ?",
        [idSede]
      );

      if (respuestaLuva[0][0]) {
        // Verifica si se encontró un registro antes de enviar la respuesta.
        const respuesta = respuestaLuva[0][0];
        res.status(200).json(respuesta);
      } else {
        res.status(404).json({ error: "Registro no encontrado" });
      }

      connection.commit();
    } catch (error) {
      // Manejar el error de consulta SQL aquí.
      res
        .status(500)
        .json({ mensaje: "Error en la consulta SQL", error: error });
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

export const actualizarSede = async (req, res) => {
  const { idSede } = req.params;
  const { nombre, telefono, direccion } = req.body;

  console.log(idSede);

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const respuesta = await pool.query(
        "SELECT *FROM sede  WHERE id_sede = ?",
        [idSede]
      );

      if (respuesta[0].length === 0) {
        res.status(404).json({ error: "No se encontró ningún trabajador" });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }

    try {
      const sql = `
                 UPDATE sede
                SET nombre_sede = ?, telefono = ?, direccion = ?
                 WHERE id_sede = ?
                `;

      await connection.query(sql, [nombre, telefono, direccion, idSede]);

      res.status(200).json({ respuesta: "EXAMEN ACTUALIZADO CON ÉXITO" });
      await connection.commit();
    } catch (error) {
      res.status(500).json({ error: error });
      await connection.rollback();
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "ERROR AL MOMENTO DE CONECTARSE A LA BASE DE DATOS" });
  }
};
