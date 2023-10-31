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

    const respuesta = await connection.query("select *from solicitud");

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
