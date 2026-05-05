// src/controllers/paciente.controller.ts
import { Request, Response } from "express";
import { pacienteService } from "../services/paciente.service";

export const crearPaciente = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user.username;

    const data = await pacienteService.crearPaciente(req.body, usuario);

    return res.status(201).json({
      code: 201,
      message: "Paciente creado exitosamente",
      data
    });

  } catch (error: any) {
  if (error.code === "ORA-00001") {
    return res.status(400).json({
      code: 400,
      message: "El número de identificación ya existe",
      data: null
    });
  }

  return res.status(500).json({
    code: 500,
    message: "Error interno del servidor",
    data: null
  });
}
};