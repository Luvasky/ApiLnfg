import { pool } from "./db.js";

export const obtenerListaEmpresas = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();

    const respuesta = await connection.query("select *from empresa");

    await connection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    res.status(500).json({
      message: "OCURRIO UN ERROR AL LISTAR LAS EMPRESAS",
      error: error,
    });

    await connection.rollback();
  } finally {
    connection.release();
  }
};

export const crearEmpresa = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { nombre } = req.body;

    await connection.query("insert into empresa(nombre) values(?)", [nombre]);

    res.status(200).json({ message: "EMPRESA CREADA" });

    await connection.beginTransaction();
  } catch (error) {
    res
      .status(500)
      .json({ message: "OCURRIO UN ERROR AL CREAR UNA EMPRESA", error: error });
    await connection.rollback();
  } finally {
    connection.release();
  }
};
