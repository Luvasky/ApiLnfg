import { pool } from "./db.js";

export const crearOrden = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      id_tecnico,
      id_paciente,
      id_admisionista,
      id_sede,
      examenes,
      paquetes,
      req_paquetes,
      req_examenes,
      fecha_examen,
      tipo_servicio,
      tipo_paciente,
      estado,
      valor_copago,
      valor_domicilio,
      valor_examenes,
      valor_paquetes,
      valor_factura,
    } = req.body;

    await connection.query(
      `insert into orden(id_tecnico,
        id_paciente,
        id_admisionista,
        id_sede,
        examenes,
        paquetes,
        req_paquetes,
        req_examenes,
        fecha_examen,
        tipo_servicio,
        tipo_paciente,
        estado,
        valor_copago,
        valor_domicilio,
        valor_examenes,
        valor_paquetes,
        valor_factura
        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id_tecnico,
        id_paciente,
        id_admisionista,
        id_sede,
        examenes || "NO",
        paquetes || "NO",
        req_paquetes || "NO",
        req_examenes || "NO",
        fecha_examen,
        tipo_servicio,
        tipo_paciente,
        estado,
        valor_copago || 0,
        valor_domicilio || 0,
        valor_examenes || 0,
        valor_paquetes || 0,
        valor_factura || 0,
      ]
    );

    res.status(200).json({ message: "ORDEN CREADA CON EXITO" });

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ message: "OCURRIO UN ERROR AL CREAR LA ORDEN", error: error });
  } finally {
    await connection.release();
  }
};

export const obtenerListaOrden = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const respuesta = await connection.query("select *from orden");

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS ORDENES",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};
