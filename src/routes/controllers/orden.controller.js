import { pool } from "./db.js";

export const crearOrden = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      id_tecnico,
      id_paciente,
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
        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id_tecnico,
        id_paciente,
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

export const obtenerListaOrdenTecnico = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const { documento } = req.params;

    const respuesta = await connection.query(
      "select * from orden where id_tecnico = ?  && estado != ?",
      [documento, "CANCELADO"]
    );

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS ORDENES DEL TECNICO",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const CancelarOrden = async (req, res) => {
  const connection = await pool.getConnection();
  const idOrden = req.params.idOrden;

  try {
    connection.beginTransaction();

    const respuesta = await connection.query(
      `
    update orden
      set estado= ?
      where id_orden =?
    
    `,
      ["CANCELADO", idOrden]
    );

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL CANCELAR LA ORDEN",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const ImprimirOrden = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const { documento } = req.params;
    const { fecha_examen } = req.body;

    const respuesta = await connection.query(
      "select * from orden where id_tecnico = ?  && estado = ?  && fecha_examen =? ",
      [documento, "ACTIVA", fecha_examen]
    );

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS ORDENES DEL TECNICO",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const realizada = async (req, res) => {
  const connection = await pool.getConnection();
  const { idOrden } = req.body;

  try {
    connection.beginTransaction();

    await connection.query(
      `
      update orden
      set estado= ?
      where id_orden = ?    
    `,
      ["REALIZADA", idOrden]
    );

    res.status(200).json({ message: "CAMBIO A RELIZADA" });

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

export const rechazada = async (req, res) => {
  const connection = await pool.getConnection();
  const { idOrden } = req.body;

  try {
    connection.beginTransaction();

    await connection.query(
      `
      update orden
      set estado= ?
      where id_orden = ?    
    `,
      ["RECHAZADA", idOrden]
    );

    res.status(200).json({ message: "CAMBIO A RECHAZADA" });

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
