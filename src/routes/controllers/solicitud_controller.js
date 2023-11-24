import { pool } from "./db.js";

export const crearSolicitud = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const {
      documento,
      nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      fecha,
      tipo_servicio,
      empresa,
    } = req.body;

    await connection.query(
      `insert into solicitud(documento, nombre, segundo_nombre,primer_apellido, segundo_apellido,empresa, fecha, tipo_servicio )values(?,?,?,?,?,?,?,?)`,
      [
        documento,
        nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        empresa,
        fecha,
        tipo_servicio,
      ]
    );

    res.status(200).json({ message: "SOLICITUD ENVIADA CORRECTAMENTE" });

    await connection.commit();
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR AL ENVIAR LA SOLICITUD", error: error });
    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const obtenerListaSolicitud = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const respuesta = await connection.query(
      "select *from solicitud where estado= ?",
      ["PENDIENTE"]
    );

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS SOLICITUDES",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const obtenerListaSolicitudTomada = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const respuesta = await connection.query(
      "select *from solicitud where estado= ?",
      ["TOMADA"]
    );

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS SOLICITUDES",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const crearSolicitudWompi = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const { idwompi_solicitud, documento, examenes, paquetes } = req.body;

    // Obtén la fecha y hora actuales
    const fecha_actual = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await connection.query(
      `INSERT INTO wompi_solicitud (idwompi_solicitud, documento, fecha_ingreso, examenes, paquetes) VALUES (?, ?, ?, ?, ?)`,
      [idwompi_solicitud, documento, fecha_actual, examenes, paquetes]
    );

    res.status(200).json({ message: "SOLICITUD ENVIADA CORRECTAMENTE" });

    await connection.commit();
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR AL ENVIAR LA SOLICITUD", error: error });
    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const obtenerListaSolicitudWompi = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const respuesta = await connection.query("select *from wompi_solicitud");

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS SOLICITUDES",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const borrarSolicitud = async (req, res) => {
  const connection = await pool.getConnection();
  const idReq = req.params.idReq;

  try {
    connection.beginTransaction();

    await connection.query(
      "delete from wompi_solicitud where idwompi_solicitud =?",
      [idReq]
    );

    await connection.commit();
    res.status(200).json({ respuesta: "BORRADO CON EXITO" });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL BORRAR LA SOLICITUD",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const listarSlicitudWompiRef = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const { idReq } = req.params;

    try {
      const respuestaLuva = await connection.query(
        "select * from wompi_solicitud where idwompi_solicitud = ?",
        [idReq]
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

export const recuperarPass = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const { idReq } = req.params;

    try {
      const respuestaLuva = await connection.query(
        "select * from wompi_solicitud where idwompi_solicitud = ?",
        [idReq]
      );

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

export const asignarTomada = async (req, res) => {
  const connection = await pool.getConnection();
  const { idOrden } = req.body;

  try {
    connection.beginTransaction();

    await connection.query(
      `
      update solicitud
      set estado= ?
      where id_solicitud = ?    
    `,
      ["TOMADA", idOrden]
    );

    res.status(200).json({ message: "CAMBIO A TOMADA" });

    await connection.commit();
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERROR AL ENVIAR LA SOLICITUD", error: error });
    await connection.rollback();
  } finally {
    connection.release();
  }
};
