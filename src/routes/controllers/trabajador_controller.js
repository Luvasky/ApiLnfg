import { pool } from "./db.js";

export const obtenerTrabajadores = async (req, res) => {
  let connnection;

  try {
    connnection = await pool.getConnection();
    connnection.beginTransaction();

    const respuesta = await connnection.query(
      `select persona.tipo_documento, persona.documento, persona.nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido, persona.edad, persona.email,
      persona.fecha_nacimiento, persona.celular, persona.sexo, trabajador.id_sede, trabajador.id_trabajador, usuario.id_usuario, usuario.contrasena, usuario.rol, usuario.estado
      from persona 
      inner join usuario on persona.documento = usuario.documento
      inner join trabajador on persona.documento = trabajador.documento
      
      `
    );

    await connnection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    if (connnection) {
      await connnection.rollback();
    }

    res.status(500).json({
      message: "OCURRIO UN ERROR AL MOMENTO DE LISTAR LOS TRABAJADORES",
      error: error,
    });
  } finally {
    if (connnection) {
      connnection.release();
    }
  }
};

export const crearTrabajador = async (req, res) => {
  const {
    tipo_documento,
    documento,
    nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    edad,
    email,
    fecha_nacimiento,
    celular,
    estado,
    rol,
    id_sede,
    contrasena,
    sexo,
  } = req.body;

  let connnection;

  try {
    connnection = await pool.getConnection();
    connnection.beginTransaction();

    await connnection.query(
      `insert into persona (tipo_documento, documento, nombre, segundo_nombre, primer_apellido, segundo_apellido, edad, email, fecha_nacimiento, celular, sexo) values(?,?,?,?,?,?,?,?,?,?,?)`,
      [
        tipo_documento,
        documento,
        nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        edad,
        email,
        fecha_nacimiento,
        celular,
        sexo, // Asegúrate de que tengas la variable "sexo" definida en algún lugar
      ]
    );

    await connnection.query(
      `insert into trabajador (documento,  id_sede) values(?,?)`,
      [documento, id_sede]
    );

    await connnection.query(
      `insert into usuario (documento, contrasena, estado, rol) values(?,?,?,?)`,
      [documento, contrasena, "ACTIVO".toUpperCase(), rol.toUpperCase()]
    );

    switch (rol) {
      case "ADMINISTRADOR":
        await connnection.query(
          "insert into administrator (id_trabajador)values(?)",
          [documento]
        );

        break;

      case "ADMISIONISTA":
        await connnection.query(
          "insert into admisionista (id_trabajador)values(?)",
          [documento]
        );

        break;

      case "TECNICO":
        await connnection.query(
          "insert into tecnico (id_trabajador)values(?)",
          [documento]
        );

        break;

      case "LABORATORIO":
        await connnection.query(
          "insert into laboratorio (id_trabajador)values(?)",
          [documento]
        );

        break;
    }

    await connnection.commit();
    res.status(200).json({ respuesta: "USUARIO CREADO CON ÉXITO" });
  } catch (error) {
    await connnection.rollback();
    res.status(500).json({
      message: "OCURRIÓ UN ERROR AL CREAR AL TRABAJADOR",
      error: error.message, // Muestra el mensaje de error específico
    });
  } finally {
    if (connnection) {
      connnection.release(); // Asegúrate de liberar la conexión en cualquier caso
    }
  }
};

export const obtenerTrabajadorDocumento = async (req, res) => {
  let connnection;
  const { documento } = req.params;

  try {
    connnection = await pool.getConnection();
    connnection.beginTransaction();

    const respuesta = await connnection.query(
      `select persona.tipo_documento, persona.documento, persona.nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido, persona.edad, persona.email,
      persona.fecha_nacimiento, persona.celular, persona.sexo, trabajador.id_sede, trabajador.id_trabajador, usuario.id_usuario, usuario.contrasena, usuario.rol, usuario.estado
      from persona 
      inner join usuario on persona.documento = usuario.documento
      inner join trabajador on persona.documento = trabajador.documento
      where persona.documento = ?
      `,
      [documento]
    );

    await connnection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    await connnection.rollback();
    res
      .status(500)
      .json({ message: "ERROR AL OBTENER EL TRABAJADOR", error: error });
  }
};

export const actualizarTrabajador = async (req, res) => {
  const { documentoReq } = req.params;
  const {
    tipo_documento,
    documento,
    nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    edad,
    email,
    fecha_nacimiento,
    celular,
    estado,
    rol,
    id_sede,
    contrasena,
    sexo,
  } = req.body;

  let connection;

  connection = await pool.getConnection();
  try {
    connection.beginTransaction();

    const respuesta = await connection.query(
      "select *from persona where documento = ?",
      [documentoReq]
    );

    if (respuesta[0].length == 0) {
      res.status(500).json({ message: "NO HAY REGISTRO CONO ESE DOCUMENTO" });
      return;
    }

    await connection.query(
      `
      UPDATE persona
      SET tipo_documento = ?, nombre = ?, segundo_nombre = ?, primer_apellido = ?,
      segundo_apellido = ?, edad = ?, email = ?, fecha_nacimiento = ?, celular = ?, sexo = ?
      WHERE documento = ?
     `,
      [
        tipo_documento,
        nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        edad,
        email,
        fecha_nacimiento,
        celular,
        sexo,
        documentoReq,
      ]
    );

    await connection.query(
      `
      UPDATE trabajador
      SET  id_sede = ?
      WHERE documento = ?
     `,
      [id_sede, documentoReq]
    );

    await connection.query(
      `
      UPDATE usuario
      SET  contrasena = ?, estado = ?, rol=?
      WHERE documento = ?
     `,
      [contrasena, estado, rol, documentoReq]
    );

    await connection.commit();
    res
      .status(200)
      .json({ respuesta: "EL REGISTRO HA SIDO ACTUALIZADO CON EXITO" });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    res.status(500).json({
      message: "OCURRIO UN ERROR AL ACTULIAZAR LA BASE DE DATOS",
      error: error,
    });
  }
};

export const obtenerTecnicos = async (req, res) => {
  let connnection;

  try {
    connnection = await pool.getConnection();
    connnection.beginTransaction();

    const respuesta = await connnection.query(
      `select persona.documento, persona.nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido
      from persona 
      inner join usuario on persona.documento = usuario.documento
      inner join trabajador on persona.documento = trabajador.documento
      where usuario.rol= ?
       
      
      `,
      ["TECNICO"]
    );

    await connnection.commit();
    res.status(200).json({ respuesta: respuesta[0] });
  } catch (error) {
    if (connnection) {
      await connnection.rollback();
    }

    res.status(500).json({
      message: "OCURRIO UN ERROR AL MOMENTO DE LISTAR LOS TRABAJADORES",
      error: error,
    });
  } finally {
    if (connnection) {
      connnection.release();
    }
  }
};
