import { AppDataSource } from "../config/data-source";
import { Paciente } from "../entities/paciente.entity";

export const pacienteRepository = AppDataSource.getRepository(Paciente);