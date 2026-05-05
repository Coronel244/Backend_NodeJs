import { CreatePacienteDto } from "../dtos/create-paciente.dto";
import { PacienteResponseDto } from "../dtos/paciente-response.dto";
import { pacienteRepository } from "../repositories/paciente.repository";
import { tipoIdentificacionRepository } from "../repositories/tipo-identificacion.repository";
import { AppDataSource } from "../config/data-source";

export const pacienteService = {

  //post de pacientes -----------------------
  async crearPaciente(
    body: CreatePacienteDto,
    usuario: string
  ): Promise<PacienteResponseDto> {

    const {
      codigo_tipo_identificacion,
      numero_identificacion,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      email
    } = body;

    // NORMALIZACIÓN
    const numero = numero_identificacion.trim();
    const primerNombre = primer_nombre.trim().toUpperCase();
    const segundoNombre = segundo_nombre?.trim().toUpperCase();
    const primerApellido = primer_apellido.trim().toUpperCase();
    const segundoApellido = segundo_apellido?.trim().toUpperCase();
    const correo = email.trim().toLowerCase();
    const codigoTipo = codigo_tipo_identificacion.trim().toUpperCase();

    // VALIDACIONES (igual que ya tienes)
    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const soloNumeros = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!soloLetras.test(primerNombre)) {
      throw { code: 400, message: "Primer nombre no válido" };
    }

    if (!soloNumeros.test(numero)) {
      throw { code: 400, message: "Número de identificación inválido" };
    }

    if (!emailRegex.test(correo)) {
      throw { code: 400, message: "Email inválido" };
    }

    // DUPLICADO
    const existe = await pacienteRepository.findOne({
      where: { numeroIdentificacion: numero }
    });

    if (existe) {
      throw { code: 400, message: "El número de identificación ya existe" };
    }

    // TIPO IDENTIFICACIÓN
    const tipo = await tipoIdentificacionRepository.findOne({
      where: {
        codigoTipoIdentificacion: codigoTipo,
        estado: "A"
      }
    });

    if (!tipo) {
      throw { code: 400, message: "Tipo de identificación inválido" };
    }

    // SECUENCIA
    const result = await AppDataSource.query(
      `SELECT MGM_SEQ_PACIENT.NEXTVAL as ID FROM dual`
    );

    const idPaciente = result[0].ID;

    const nombreCompleto = [
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido
    ].filter(Boolean).join(" ");

    const paciente = pacienteRepository.create({
      idPaciente,
      numeroIdentificacion: numero,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      nombreCompleto,
      email: correo,
      estado: "A",
      fechaIngreso: new Date(),
      usuarioIngreso: usuario,
      tipoIdentificacion: tipo
    });

    await pacienteRepository.save(paciente);

    // DTO RESPONSE
    return {
      id_paciente: paciente.idPaciente,
      numero_identificacion: paciente.numeroIdentificacion,
      primer_nombre: paciente.primerNombre,
      segundo_nombre: paciente.segundoNombre,
      primer_apellido: paciente.primerApellido,
      segundo_apellido: paciente.segundoApellido,
      nombre_completo: paciente.nombreCompleto,
      email: paciente.email,
      estado: paciente.estado,
      fecha_ingreso: paciente.fechaIngreso,
      usuario_ingreso: paciente.usuarioIngreso,
      tipo_identificacion: {
        codigo_tipo_identificacion: tipo.codigoTipoIdentificacion,
        nombre_tipo_identificacion: tipo.nombreTipoIdentificacion
      }
    };
  },


//get de pacientes activos-----------------------

async obtenerPorId(idPaciente: number) {

  const paciente = await pacienteRepository
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.tipoIdentificacion", "t")
    .where("p.idPaciente = :id", { id: idPaciente })
    .getOne();

  if (!paciente) {
    throw { code: 404, message: "Paciente no encontrado" };
  }

  return {
    id_paciente: paciente.idPaciente,
    numero_identificacion: paciente.numeroIdentificacion,
    primer_nombre: paciente.primerNombre,
    segundo_nombre: paciente.segundoNombre,
    primer_apellido: paciente.primerApellido,
    segundo_apellido: paciente.segundoApellido,
    nombre_completo: paciente.nombreCompleto,
    email: paciente.email,
    estado: paciente.estado,
    fecha_ingreso: paciente.fechaIngreso,
    usuario_ingreso: paciente.usuarioIngreso,
    tipo_identificacion: {
      codigo_tipo_identificacion: paciente.tipoIdentificacion.codigoTipoIdentificacion,
      nombre_tipo_identificacion: paciente.tipoIdentificacion.nombreTipoIdentificacion
    }
  };
},




// put de pacientes por id -----------------------
async actualizarPaciente(id: number, body: any, usuario: string) {

  const paciente = await pacienteRepository.findOne({
    where: { idPaciente: id }
  });

  if (!paciente) {
    throw { code: 404, message: "Paciente no encontrado" };
  }

  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    email
  } = body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { code: 400, message: "Email inválido" };
    }
    paciente.email = email.trim().toLowerCase();
  }

  if (primer_nombre) paciente.primerNombre = primer_nombre.trim().toUpperCase();
  if (segundo_nombre !== undefined) paciente.segundoNombre = segundo_nombre?.trim().toUpperCase();
  if (primer_apellido) paciente.primerApellido = primer_apellido.trim().toUpperCase();
  if (segundo_apellido !== undefined) paciente.segundoApellido = segundo_apellido?.trim().toUpperCase();

  // reconstruir nombre completo
  paciente.nombreCompleto = [
    paciente.primerNombre,
    paciente.segundoNombre,
    paciente.primerApellido,
    paciente.segundoApellido
  ].filter(Boolean).join(" ");

  paciente.usuarioModificacion = usuario;
  paciente.fechaModificacion = new Date();

  await pacienteRepository.save(paciente);

  return { id_paciente: paciente.idPaciente };
},



// delete de pacientes por id -----------------------

async eliminarPaciente(id: number, usuario: string) {

  const paciente = await pacienteRepository.findOne({
    where: { idPaciente: id }
  });

  if (!paciente) {
    throw { code: 404, message: "Paciente no encontrado" };
  }

  paciente.estado = "I";
  paciente.usuarioModificacion = usuario;
  paciente.fechaModificacion = new Date();

  await pacienteRepository.save(paciente);

  return { id_paciente: paciente.idPaciente };
}
















};