// src/services/paciente.service.ts
import { AppDataSource } from "../config/data-source";
import { Paciente } from "../entities/paciente.entity";
import { TipoIdentificacion } from "../entities/tipo-identificacion.entity";

const pacienteRepo = AppDataSource.getRepository(Paciente);
const tipoRepo = AppDataSource.getRepository(TipoIdentificacion);

export const pacienteService = {

  async crearPaciente(body: any, usuario: string) {

    const {
      codigo_tipo_identificacion,
      numero_identificacion,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      email
    } = body;

    //  Validaciones básicas
    if (!codigo_tipo_identificacion || !numero_identificacion || !primer_nombre || !primer_apellido || !email) {
      throw { code: 400, message: "Campos obligatorios faltantes" };
    }

    //  Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { code: 400, message: "Email inválido" };
    }

    // Validar tipo identificación
    const tipo = await tipoRepo.findOne({
      where: {
        codigoTipoIdentificacion: codigo_tipo_identificacion,
        estado: "A"
      }
    });

    if (!tipo) {
      throw { code: 400, message: "Tipo de identificación inválido o inactivo" };
    }

    // Obtener secuencia Oracle
    const result = await AppDataSource.query(
      `SELECT MGM_SEQ_PACIENT.NEXTVAL as id FROM dual`
    );

    const idPaciente = result[0].ID;

    //  Construir nombre completo
    const nombreCompleto = [
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido
    ].filter(Boolean).join(" ");

    // Crear objeto
    const paciente = pacienteRepo.create({
      idPaciente,
      numeroIdentificacion: numero_identificacion,
      primerNombre: primer_nombre,
      segundoNombre: segundo_nombre,
      primerApellido: primer_apellido,
      segundoApellido: segundo_apellido,
      nombreCompleto,
      email,
      estado: "A",
      fechaIngreso: new Date(),
      usuarioIngreso: usuario,
      tipoIdentificacion: tipo
    });

    //  Guardar
    await pacienteRepo.save(paciente);

    return paciente;
  }

};