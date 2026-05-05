import { Request, Response } from "express";
import { pacienteService } from "../services/paciente.service";

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

    console.log("ERROR REAL:", error);


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

    const id = Number(req.params.id);

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
    const id = Number(req.params.id);

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





