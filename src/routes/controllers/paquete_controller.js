import { pool } from "./db.js";

export const crearPaquete = async (req, res) => {
  const connecton = await pool.getConnection();
  connecton.beginTransaction();

  try {
    const { id_paquete, nombre, precio, examenes, descripcion } = req.body;

    const respuesta = await connecton.query(
      "insert into paquete(id_paquete, nombre, precio, examenes, descripcion) values(?,?,?,?,?)",
      [id_paquete, nombre, precio, examenes, descripcion]
    );

    await connecton.commit();
    res.status(200).json({ message: "PAQUETE CREADO CON EXITO" });
  } catch (error) {
    await connecton.rollback();
    res
      .status(500)
      .json({ message: "OCURRIO UN ERROR AL CREAR UN PAQUETE", error: error });
  } finally {
    connecton.release();
  }
};

export const obtenerListaPaquete = async (req, res) => {
  const connenction = await pool.getConnection();
  connenction.beginTransaction();

  try {
    const respuesta = await connenction.query("select *from paquete");

    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    await connenction.rollback();
    res.status(500).json({
      message: "OCURRIO UN ERROR AL TRAER LOS PAQUETES",
      error: error,
    });
  } finally {
    connenction.release();
  }
};

export const obtenerListaPaqueteSinNO = async (req, res) => {
  const connenction = await pool.getConnection();
  connenction.beginTransaction();

  try {
    const respuesta =
      await connenction.query(`select *from paquete where nombre != "NO"
  `);

    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    await connenction.rollback();
    res.status(500).json({
      message: "OCURRIO UN ERROR AL TRAER LOS PAQUETES",
      error: error,
    });
  } finally {
    connenction.release();
  }
};

export const actualizarPaquete = async (req, res) => {
  const connenction = await pool.getConnection();
  connenction.beginTransaction();

  const { idReq } = req.params;
  const { nombre, precio, descripcion, examenes } = req.body;

  try {
    const respuesta = await connenction.query(
      "select *from paquete where id_paquete =?",
      [idReq]
    );

    if (respuesta[0].length === 0) {
      res.status(404).json({
        message: "NO SE ENCONTRO NINGUN RESGISTRO CON EL ID PROPORCIONADO",
      });

      return;
    }

    await connenction.query(
      "update paquete set nombre=?, precio=?, descripcion=?, examenes=? where id_paquete=? ",
      [nombre, precio, descripcion, examenes, idReq]
    );

    await connenction.commit();
    res.status(200).json({ resupuesta: "REGISTRO ACTUALIZADO CON EXITO" });
  } catch (error) {
    await connenction.rollback();
    res.status(500).json({
      message: "OCURRIO UN ERROR AL ACTUALIZAR EL PAQUETE",
      error: error,
    });
  } finally {
    connenction.release();
  }
};

export const obtenerPqueteId = async (req, res) => {
  const connenction = await pool.getConnection();
  connenction.beginTransaction();
  const { idReq } = req.params;

  try {
    const respuesta = await connenction.query(
      "select *from paquete where id_paquete = ?",
      [idReq]
    );

    await connenction.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    await connenction.rollback();
    res.status(500).json({
      message: "OCURRIO UN ERROR AL OBTENER EL PAQUETE",
      error: error,
    });
  } finally {
    connenction.release();
  }
};

export const sumarPrecioPaquetes = async (req, res) => {
  const connection = await pool.getConnection();
  connection.beginTransaction();
  const { paqueteReq } = req.body; // Corrección: quitar los paréntesis

  try {
    // const nuevoArreglo = examnesReq.join(",");
    // console.log(nuevoArreglo);

    const respuesta = await connection.query(
      `SELECT SUM(precio) AS suma_precios
      FROM paquete
      WHERE nombre IN (?)`,
      [paqueteReq]
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
