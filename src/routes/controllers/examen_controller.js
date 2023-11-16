import { pool } from "./db.js";

export const crearExamen = async (req, res) => {
  try {
    const { id_examen, nombre, precio, requisitos } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(
        "insert into examen(id_examen,nombre,precio,requisitos) values(?,?,?,?)",
        [id_examen, nombre, precio, requisitos]
      );

      res.status(200).json("EL EXAMEN HA SIDO CREADO EXITOSAMENTE");
      await connection.commit();
    } catch (error) {
      res.status(500).json({ error: "ERROR AL MOMENTO DE CREAR EL EXAMEN" });
      await connection.rollback();
    }
  } catch (error) {
    res.status(500).json({ error: "ERRO EN LA CONEXION A LA BASE DE DATOS" });
  }
};

export const actualizarExamen = async (req, res) => {
  const { idExamenConsulta } = req.params;
  const { id_examen, nombre, precio, requisitos } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const respuesta = await pool.query(
        "SELECT *FROM examen  WHERE id_examen = ?",
        [idExamenConsulta]
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
                 UPDATE examen
                SET nombre = ?, precio = ?, requisitos = ?
                 WHERE id_examen = ?
                `;

      await connection.query(sql, [
        nombre,
        precio,
        requisitos,
        idExamenConsulta,
      ]);

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

export const obetenerListaExamenes = async (req, res) => {
  let connection; // Declarar la variable de conexión fuera del bloque try-catch

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const respuesta = await connection.query(`select *from examen `);

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] }); // Cambiar el estado HTTP a 200 para indicar éxito
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("ERROR AL OBTENER LOS DATOS DEL EXAMEN:", error);
    res.status(500).json({ error: "ERROR AL TRAER LOS DATOS DE LOS EXAMENES" });
  } finally {
    if (connection) {
      connection.release(); // Cerrar la conexión en el bloque finally
    }
  }
};

export const obetenerListaExamenesSinNo = async (req, res) => {
  let connection; // Declarar la variable de conexión fuera del bloque try-catch

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const respuesta =
      await connection.query(`select *from examen where nombre != "NO"
    `);

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] }); // Cambiar el estado HTTP a 200 para indicar éxito
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("ERROR AL OBTENER LOS DATOS DEL EXAMEN:", error);
    res.status(500).json({ error: "ERROR AL TRAER LOS DATOS DE LOS EXAMENES" });
  } finally {
    if (connection) {
      connection.release(); // Cerrar la conexión en el bloque finally
    }
  }
};

export const obtenerExamenId = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const { id } = req.params;

    try {
      const respuestaLuva = await connection.query(
        "select * from examen where id_examen = ?",
        [id]
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

export const enviarDato = async (req, res) => {
  const connection = await pool.getConnection();
  connection.beginTransaction();
  const { dato } = req.body; // Corrección: quitar los paréntesis

  try {
    await connection.query(
      "insert into arduino(dato, hora) values (?, CURRENT_TIME())",
      [dato, ,]
    ); // Corrección: agregar un espacio antes de 'values'
    connection.commit(); // Agregar esta línea para confirmar la transacción
    res.status(200).json({ message: "Dato enviado exitosamente" }); // Envía una respuesta exitosa
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error });
  } finally {
    connection.release();
  }
};

export const sumarPrecioExamenes = async (req, res) => {
  const connection = await pool.getConnection();
  connection.beginTransaction();
  const { examnesReq } = req.body; // Corrección: quitar los paréntesis

  try {
    // const nuevoArreglo = examnesReq.join(",");
    // console.log(nuevoArreglo);

    const respuesta = await connection.query(
      `SELECT SUM(precio) AS suma_precios
      FROM examen
      WHERE nombre IN (?)`,
      [examnesReq]
    );

    connection.commit(); // Agregar esta línea para confirmar la transacción
    res.status(200).json({ respuesta: respuesta[0] }); // Envía la suma de precios como respuesta
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error });
  } finally {
    connection.release();
  }
};
