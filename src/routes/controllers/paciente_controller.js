import { connect } from "ngrok";
import { pool } from "./db.js";

export const crearPaciente = async (req, res) => {
  try {
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
      contrasena,
      tipo,
      direccion,
      desc_direccion,
      sexo,
    } = req.body;

    // Iniciar una transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Consulta 1: Insertar en la tabla 'persona'
      await connection.query(
        "INSERT INTO persona(tipo_documento,documento,nombre,segundo_nombre,primer_apellido,segundo_apellido,edad,email,fecha_nacimiento,celular,sexo) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
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
          sexo,
        ]
      );

      // Consulta 2: Insertar en la tabla 'paciente'
      await connection.query(
        "INSERT INTO paciente(documento,tipo,direccion,desc_dir) VALUES (?,?,?,?)",
        [documento, tipo, direccion, desc_direccion]
      );

      const estado = "ACTIVO";
      const rol = "USUARIO";
      // Consulta 3: Insertar en la tabla 'usuario'
      await connection.query(
        "INSERT INTO usuario(documento, contrasena,estado,rol) VALUES (?,?,?,?)",
        [documento, contrasena, estado, rol]
      );

      // Si todas las consultas se realizaron con éxito, confirmar la transacción
      await connection.commit();
      connection.release(); // Liberar la conexión

      // Enviar una respuesta de éxito
      res.status(200).json({ message: "Paciente creado con éxito" });
    } catch (error) {
      // Si alguna consulta falla, hacer un rollback para deshacer los cambios y liberar la conexión
      await connection.rollback();
      connection.release();
      console.error("Error al crear el paciente:", error);
      res.status(500).json({ error: "El paciente ya existe" });
    }
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const obtenerListaPacientes = async (req, res) => {
  let connection; // Declarar la variable de conexión fuera del bloque try-catch

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    const respuesta = await connection.query(`
      SELECT persona.tipo_documento, persona.documento, persona.nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido,
      persona.email, persona.celular, persona.fecha_nacimiento,persona.sexo,persona.edad, paciente.tipo, paciente.direccion, paciente.desc_dir, usuario.estado,usuario.rol,usuario.contrasena
      FROM persona
      INNER JOIN paciente ON persona.documento = paciente.documento
      INNER JOIN usuario ON persona.documento = usuario.documento
    `);

    await connection.commit();
    res.status(200).json({ respuesta: respuesta }); // Cambiar el estado HTTP a 200 para indicar éxito
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("ERROR AL OBTENER LOS DATOS DEL PACIENTE:", error);
    res
      .status(500)
      .json({ error: "ERROR AL TRAER LOS DATOS DE LOS PACIENTES" });
  } finally {
    if (connection) {
      connection.release(); // Cerrar la conexión en el bloque finally
    }
  }
};

export const obtenerPacienteDocumento = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    try {
      const { documento } = req.params;

      const respuesta = await connection.query(
        `select persona.tipo_documento,persona.documento, persona.nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido,
        persona.email,persona.edad,persona.sexo, persona.celular, persona.fecha_nacimiento, paciente.tipo, paciente.direccion, paciente.desc_dir, usuario.contrasena, usuario.estado, usuario.rol
        from persona
        inner join paciente on persona.documento = paciente.documento
        inner join usuario on persona.documento = usuario.documento
        where persona.documento = ?`,
        [documento]
      );

      res.status(200).json({ respuesta: respuesta[0][0] });
      await connection.commit();
    } catch (error) {
      res.status(500).json({
        error: error,
        message: "OCURRIO UN ERROR AL REALIZAR LA CONSULTA",
      });
      await connection.rollback();
    }
  } catch (error) {
    res.status(500).json({
      message: "ERROR AL CONECTARSE A LA BASE DE DATOS",
      error: error,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const actualizarPaciente = async (req, res) => {
  const { documentoReq } = req.params;
  const {
    tipo_documento,
    nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    edad,
    email,
    fecha_nacimiento,
    celular,
    contrasena,
    tipo,
    direccion,
    desc_dir,
    sexo,
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    try {
      const respuesta = await connection.query(
        "SELECT * FROM paciente WHERE documento = ?",
        [documentoReq]
      );

      if (respuesta[0].length === 0) {
        res.status(404).json({ error: "NO SE ENCONTRÓ NINGÚN PACIENTE" });
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
        UPDATE paciente
        SET  tipo = ?, direccion = ?, desc_dir = ?
        WHERE documento = ?
       `,
        [tipo, direccion, desc_dir, documentoReq]
      );

      await connection.query(
        `
        UPDATE usuario
        SET  contrasena = ?
        WHERE documento = ?
       `,
        [contrasena, documentoReq]
      );

      await connection.commit();

      res.status(200).json({ message: "PACIENTE ACTUALIZADO EXITOSAMENTE" });
    } catch (error) {
      await connection.rollback();
      res
        .status(500)
        .json({ error: error, message: "ERROR EN LA ACTUALIZACIÓN" });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({
      message: "ERROR AL CONECTARSE A LA BASE DE DATOS",
      error: error,
    });
  }
};

export const actualizarDireccion = async (req, res) => {
  let connection; // Declarar la variable de conexión fuera del bloque try-catch
  const { documento } = req.params;
  const { direccion, descripcion } = req.body;

  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    if (direccion.length !== 0 && descripcion.length === 0) {
      const respuesta = await connection.query(
        `
    UPDATE paciente
    SET direccion = ?
    WHERE documento = ?;
    
    `,
        [direccion, documento]
      );
      res.status(200).json({ respuesta: respuesta }); // Cambiar el estado HTTP a 200 para indicar éxito

      await connection.commit();
    } else if (direccion.length === 0 && descripcion.length !== 0) {
      const respuesta = await connection.query(
        `
    UPDATE paciente
    SET desc_dir = ?
    WHERE documento = ?;
    
    `,
        [descripcion, documento]
      );
      res.status(200).json({ respuesta: respuesta }); // Cambiar el estado HTTP a 200 para indicar éxito
      console.log("ESTOY AQUI");
      await connection.commit();
    } else {
      const respuesta = await connection.query(
        `
        UPDATE paciente
        SET direccion = ?,
            desc_dir = ?
        WHERE documento = ?;
        
    
    `,
        [direccion, descripcion, documento]
      );
      res.status(200).json({ respuesta: respuesta }); // Cambiar el estado HTTP a 200 para indicar éxito

      await connection.commit();
    }
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("ERROR AL ACTUALIZAR EL PACIENTE:", error);
    res
      .status(500)
      .json({ error: "ERROR AL TRAER LOS DATOS DE LOS PACIENTES" });
  } finally {
    if (connection) {
      connection.release(); // Cerrar la conexión en el bloque finally
    }
  }
};
