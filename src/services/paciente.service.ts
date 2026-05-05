import { pacienteRepository } from "../repositories/paciente.repository";
import { tipoIdentificacionRepository } from "../repositories/tipo-identificacion.repository";
import { AppDataSource } from "../config/data-source";

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

    // VALIDACIONES
    if (!codigo_tipo_identificacion || !numero_identificacion || !primer_nombre || !primer_apellido || !email) {
      throw { code: 400, message: "Campos obligatorios faltantes" };
    }

    // NORMALIZACION DE DATOS
    const numeroIdentificacionClean = numero_identificacion.trim();
    const primerNombreClean = primer_nombre.trim().toUpperCase();
    const segundoNombreClean = segundo_nombre?.trim().toUpperCase();
    const primerApellidoClean = primer_apellido.trim().toUpperCase();
    const segundoApellidoClean = segundo_apellido?.trim().toUpperCase();
    const emailClean = email.trim().toLowerCase();
    const codigoTipoClean = codigo_tipo_identificacion.trim().toUpperCase();

    if (!codigoTipoClean || !numeroIdentificacionClean || !primerNombreClean || !primerApellidoClean || !emailClean) {
      throw { code: 400, message: "Campos obligatorios faltantes" };
    }

    // VALIDAR SOLO LETRAS EN NOMBRES
    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

    if (!soloLetras.test(primerNombreClean)) {
      throw { code: 400, message: "Primer nombre no puede contener numeros" };
    }

    if (segundoNombreClean && !soloLetras.test(segundoNombreClean)) {
      throw { code: 400, message: "Segundo nombre invalido" };
    }

    if (!soloLetras.test(primerApellidoClean)) {
      throw { code: 400, message: "Primer apellido no puede contener numeros" };
    }

    if (segundoApellidoClean && !soloLetras.test(segundoApellidoClean)) {
      throw { code: 400, message: "Segundo apellido invalido" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      throw { code: 400, message: "Email invalido" };
    }

    const soloNumeros = /^\d+$/;
    if (!soloNumeros.test(numeroIdentificacionClean)) {
      throw { code: 400, message: "Numero de identificacion invalido" };
    }

    // VALIDAR DUPLICADO
    const existe = await pacienteRepository.findOne({
      where: { numeroIdentificacion: numeroIdentificacionClean }
    });

    if (existe) {
      throw { code: 400, message: "El numero de identificacion ya existe" };
    }

    // VALIDAR TIPO IDENTIFICACION
    const tipo = await tipoIdentificacionRepository.findOne({
      where: {
        codigoTipoIdentificacion: codigoTipoClean,
        estado: "A"
      }
    });

    if (!tipo) {
      throw { code: 400, message: "Tipo de identificacion invalido o inactivo" };
    }

    // SECUENCIA ORACLE
    const result = await AppDataSource.query(
      `SELECT MGM_SEQ_PACIENT.NEXTVAL as ID FROM dual`
    );

    const idPaciente = result[0].ID;

    // NOMBRE COMPLETO
    const nombreCompleto = [
      primerNombreClean,
      segundoNombreClean,
      primerApellidoClean,
      segundoApellidoClean
    ].filter(Boolean).join(" ");

    // CREAR ENTIDAD
    const paciente = pacienteRepository.create({
      idPaciente,
      numeroIdentificacion: numeroIdentificacionClean,
      primerNombre: primerNombreClean,
      segundoNombre: segundoNombreClean,
      primerApellido: primerApellidoClean,
      segundoApellido: segundoApellidoClean,
      nombreCompleto,
      email: emailClean,
      estado: "A",
      fechaIngreso: new Date(),
      usuarioIngreso: usuario,
      tipoIdentificacion: tipo
    });

    await pacienteRepository.save(paciente);

    // DTO DE RESPUESTA
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
  }
};
