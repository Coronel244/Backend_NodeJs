import { AppDataSource } from "../config/data-source";
import { TipoIdentificacion } from "../entities/tipo-identificacion.entity";

export const tipoIdentificacionRepository =
  AppDataSource.getRepository(TipoIdentificacion);