import { Request, Response } from "express";
import { pacienteService } from "../services/paciente.service";

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