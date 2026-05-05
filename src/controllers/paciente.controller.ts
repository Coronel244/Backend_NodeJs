import { Request, Response } from "express";
import { pacienteService } from "../services/paciente.service";

const obtenerIdPaciente = (req: Request) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw { code: 400, message: "Id de paciente invalido" };
  }

  return id;
};

//post de pacientes -----------------------
export const crearPaciente = async (req: Request, res: Response) => {
  try {

    const usuario = (req as any).user?.username || (req as any).user;

    const data = await pacienteService.crearPaciente(req.body, usuario);

    return res.status(201).json({
      code: 201,
      message: "Paciente creado exitosamente",
      data
    });

  } catch (error: any) {

    


    const status = typeof error.code === "number" ? error.code : 500;
    return res.status(error.code || 500).json({
      code: status,
      message: error.message || "Error interno del servidor",
      data: null
    });
  }
};


// get de pacientes activos-----------------------

export const obtenerPaciente = async (req: Request, res: Response) => {
  try {

    const id = obtenerIdPaciente(req);

    const data = await pacienteService.obtenerPorId(id);

    return res.status(200).json({
      code: 200,
      message: "Paciente encontrado",
      data
    });

  } catch (error: any) {
    return res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Error interno",
      data: null
    });
  }
};



// put de pacientes por id -----------------------

export const actualizarPaciente = async (req: Request, res: Response) => {
  try {

    const usuario = (req as any).user.username;
    const id = obtenerIdPaciente(req);

    const data = await pacienteService.actualizarPaciente(id, req.body, usuario);

    return res.status(200).json({
      code: 200,
      message: "Paciente actualizado",
      data
    });

  } catch (error: any) {
    return res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Error interno",
      data: null
    });
  }
};


// delete de pacientes por id -----------------------
export const eliminarPaciente = async (req: Request, res: Response) => {
  try {

    const usuario = (req as any).user.username;
    const id = obtenerIdPaciente(req);

    const data = await pacienteService.eliminarPaciente(id, usuario);

    return res.status(200).json({
      code: 200,
      message: "Paciente desactivado",
      data
    });

  } catch (error: any) {
    return res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Error interno",
      data: null
    });
  }
};



// Get de pacientes por criterios
export const listarPacientes = async (req: Request, res: Response) => {
  try {
    const data = await pacienteService.listar(req.query);

    return res.json({
      code: 200,
      message: "Listado de pacientes",
      data
    });

  } catch (error: any) {
    return res.status(error.code || 500).json({
      code: error.code || 500,
      message: error.message || "Error interno",
      data: null
    });
  }
};


